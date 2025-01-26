// import { useConfigStore } from '@core/stores/config'
import type { CalendarApi, CalendarOptions, EventApi, EventSourceFunc } from '@fullcalendar/core'
import esLocale from "@fullcalendar/core/locales/es"
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import type { Event, NewEvent } from './types'
import { useCalendarStore } from './useCalendarStore'
import { onMounted, ref, Ref, watch } from 'vue'
import dayjs from 'dayjs'
// import es from 'dayjs/locale/es'
// import localeData from 'dayjs/plugin/localeData'
// dayjs.extend(localeData);
// dayjs.locale(es);


export const blankEvent: Event | NewEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
        state: false,
        calendar: undefined,
        categoryId: null,
        place: '',
        createdDate: "",
        userCreated: 0,
        description: '',
        guests: [],
    },
}

export const useCalendar = (event: Ref<Event | NewEvent>, isEventHandlerSidebarActive: Ref<boolean>, isDetailActive: Ref<boolean>, isDetailActiveAnother: Ref<boolean>, isMobile: Ref<boolean>, date: Ref<any>) => {
    // //   const configStore = useConfigStore()

    // 👉 Store
    const store = useCalendarStore()

    // 👉 Calendar template ref
    const refCalendar = ref()

    // ℹ️ Extract event data from event API
    const extractEventDataFromEventApi = (eventApi: EventApi) => {
        // @ts-expect-error EventApi has extendProps type Dictionary (Record<string, any>) and we have fully typed extended props => Type conflict
        const {
            id,
            title,
            start,
            end,
            url,
            extendedProps: { state, calendar, categoryId, guests, place, createdDate, userCreated, description },
            allDay,
        }: Event = eventApi

        return {
            id,
            title,
            start,
            end,
            url,
            extendedProps: {
                state,
                calendar,
                categoryId,
                guests,
                place,
                createdDate,
                userCreated,
                description,
            },
            allDay,
        }
    }

    // if (typeof process !== 'undefined' && process.server)
    //     store.fetchEvents()

    // 👉 Fetch events
    const fetchEvents: EventSourceFunc = (info, successCallback) => {
        // If there's no info => Don't make useless API call
        if (!info)
            return

        store.fetchEvents(info.startStr, info.endStr)
            .then(r => {
                successCallback(r.map((e) => ({
                    ...e,
                    // Convert string representation of date to Date object
                    start: new Date(e.start),
                    end: new Date(e.end),
                    id: String(e.id),
                })))
            })
            .catch(e => {
                console.error('Error occurred while fetching calendar events', e)
            })
    }

    // 👉 Calendar API
    const calendarApi = ref<null | CalendarApi>(null)

    // 👉 Update event in calendar [UI]
    const updateEventInCalendar = (updatedEventData: Event, propsToUpdate: (keyof Event)[], extendedPropsToUpdate: (keyof Event['extendedProps'])[]) => {
        const existingEvent = calendarApi.value?.getEventById(String(updatedEventData.id))

        if (!existingEvent) {
            console.warn('Can\'t found event in calendar to update')

            return
        }

        // ---Set event properties except date related
        // dateRelatedProps => ['start', 'end', 'allDay']
        for (let index = 0; index < propsToUpdate.length; index++) {
            const propName = propsToUpdate[index]

            existingEvent.setProp(propName, updatedEventData[propName])
        }

        // --- Set date related props
        existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

        // --- Set event's extendedProps
        for (let index = 0; index < extendedPropsToUpdate.length; index++) {
            const propName = extendedPropsToUpdate[index]

            existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
        }
    }

    // 👉 Remove event in calendar [UI]
    const removeEventInCalendar = (eventId: string) => {
        const _event = calendarApi.value?.getEventById(eventId)

        if (_event)
            _event.remove()
    }

    // 👉 refetch events
    const refetchEvents = () => {
        calendarApi.value?.refetchEvents()
    }

    watch(() => store.selectedCalendars, refetchEvents)

    // 👉 Update event
    const updateEvent = (_event: Event) => {
        const propsToUpdate = ['id', 'title', 'url'] as (keyof Event)[]
        const extendedPropsToUpdate = ['calendar', 'categoryId', 'guests', 'deleted', 'place', 'createdDate', 'userCreated', 'project', 'description'] as (keyof Event['extendedProps'])[]
        updateEventInCalendar(_event, propsToUpdate, extendedPropsToUpdate)
        refetchEvents()
    }

    // 👉 Calendar options
    const calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        // themeSystem: 'litera',
        locale: esLocale,
        headerToolbar: {
            start: 'prev,next today',
            // start: 'drawerToggler,today,prev,next',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        },
        events: fetchEvents,

        // ❗ We need this to be true because when its false and event is allDay event and end date is same as start data then Full calendar will set end to null
        forceEventDuration: true,

        /* Enable dragging and resizing event*/
        editable: false,

        /*Enable resizing event from start*/
        eventResizableFromStart: true,

        /*Automatically scroll the scroll-containers during event drag-and-drop and date selecting*/
        dragScroll: true,

        /*Max number of events within a given day*/
        dayMaxEvents: 2,

        dayHeaderFormat: { weekday: isMobile.value ? 'short' : 'long' },
        // dayHeaderFormat: { weekday: 'long' },


        /*Determines if day names and week names are clickable*/
        // <span>${DateTime.fromJSDate(event.start as Date).toFormat('hh a').toLowerCase()}</span>
        navLinks: false,
        eventContent(arg) {
            let event = arg.event;
            let customHtml = ` 
            <div style="white-space: nowrap; ${!event.extendedProps.state ? ' text-decoration: line-through; ' : ''} overflow: hidden; text-overflow: ellipsis;"> 
            <span>${dayjs(event.start).format('hh a').toLowerCase()}</span>
            <span>- ${event.title}</span>
            </div> `;
            return { html: customHtml };
        },

        eventDidMount: function (info) {
            const colorName = store.availableCalendars.find((v: any) => v.id === info.event.extendedProps.categoryId)?.color;
            info.el.style.backgroundColor = colorName || '#78909C';
            // info.el.style.color = '#fff';
            const dot = info.el.querySelector('.fc-list-event-dot');
            if (dot instanceof HTMLElement) {
                dot.style.borderColor = colorName || '#78909C';
            }
        },

        //Show event
        eventClick({ event: clickedEvent, jsEvent }) {
            jsEvent.preventDefault()

            // if (clickedEvent.url) {
            //     // Open the URL in a new tab
            //     window.open(clickedEvent.url, '_blank')
            // }

            // * Only grab required field otherwise it goes in infinity loop
            // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
            event.value = extractEventDataFromEventApi(clickedEvent)
            if (!isDetailActive.value && !isDetailActiveAnother.value) {
                isDetailActive.value = true
            } else if (isDetailActive.value == true) {
                isDetailActiveAnother.value = true
            } else {
                isDetailActive.value = true
            }
        },

        // Add event
        dateClick(info) {
            if (!isDetailActive.value && !isDetailActiveAnother.value) {

                // const selectDate = DateTime.fromISO(info.dateStr).startOf('day')
                // const currentDate = DateTime.now().startOf('day')
                const selectDate = dayjs(info.dateStr).startOf('day')
                const currentDate = dayjs().startOf('day')

                // const selectDate = DateTime.fromISO(info.dateStr).startOf('month');
                // const currentDate = DateTime.now().startOf('month');

                if (selectDate >= currentDate) {
                    event.value = {
                        ...blankEvent,
                        start: dayjs(info.date).format("yyyy-MM-DD ") + "08:00",
                        end: dayjs(info.date).format("yyyy-MM-DD ") + "18:00"
                    };
                    // event.value = { ...blankEvent, start: DateTime.fromJSDate(info.date).toFormat("yyyy-LL-dd ") + "08:00", end: DateTime.fromJSDate(info.date).toFormat("yyyy-LL-dd ") + "18:00" }
                    isEventHandlerSidebarActive.value = true
                }
            }
        },

        datesSet: function () {
            let titleEl = document.querySelector('.fc-toolbar-title');
            if (titleEl instanceof HTMLElement) {
                titleEl.style.textTransform = 'capitalize';
            }
        },
        /*
          Handle event drop (Also include dragged event)
          We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
        */

        // eventDrop({ event: droppedEvent }) {
        //     store.updateEvent(extractEventDataFromEventApi(droppedEvent));
        // },

        /*Handle event resize*/
        eventResize({ event: resizedEvent }) {
            if (resizedEvent.start && resizedEvent.end)
                updateEvent(extractEventDataFromEventApi(resizedEvent))
        },

        customButtons: {
            drawerToggler: {
                text: 'calendarDrawerToggler',
                // click() {
                //     isLeftSidebarOpen.value = true
                // },
            },
            today: {
                text: 'Hoy', click() {
                    date.value = new Date().toISOString().substr(0, 10)
                    calendarApi.value?.gotoDate(new Date(date.value))
                }
            }
        },
    } as CalendarOptions

    // 👉 onMounted
    onMounted(() => {
        calendarApi.value = refCalendar.value.getApi()
    })

    // 👉 Jump to date on sidebar(inline) calendar change
    const jumpToDate = (currentDate: string) => {
        calendarApi.value?.gotoDate(new Date(currentDate))
    }

    //   watch(
    //     // () => configStore.isAppRTL,
    //     val => {
    //       calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
    //     },
    //     { immediate: true },
    //   )

    return {
        refCalendar,
        calendarOptions,
        refetchEvents,
        fetchEvents,
        updateEvent,
        removeEventInCalendar,
        jumpToDate,
    }
}