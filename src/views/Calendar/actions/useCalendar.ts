import type {
  CalendarApi,
  CalendarOptions,
  EventApi,
  EventSourceFunc,
} from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { Event, NewEvent } from "./types";
import { useCalendarStore } from "./useCalendarStore";
import { onMounted, ref, Ref, watch } from "vue";
import dayjs from "dayjs";

export const blankEvent: Event | NewEvent = {
  title: "",
  start: dayjs().format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
  allDay: false,
  url: "",
  extendedProps: {
    status: "Pendiente",
    calendar: "Recordatorio",
    createdDate: "",
    userCreated: 0,
    description: "",
    timeStart: null,
    timeEnd: null,
    templateId: null,
    template: null,
    totalPatients: 0,
    totalSending: 0,
    totalPending: 0,
    totalNot: 0,
    istart: dayjs().format("YYYY-MM-DD"),
    iend: dayjs().format("YYYY-MM-DD"),
  },
};

export const useCalendar = (
  event: Ref<Event | NewEvent>,
  isEventHandlerSidebarActive: Ref<boolean>,
  isDetailActive: Ref<boolean>,
  isDetailActiveAnother: Ref<boolean>,
  isMobile: Ref<boolean>,
  date: Ref<any>
) => {
  // //   const configStore = useConfigStore()

  const store = useCalendarStore();
  const refCalendar = ref();

  // ℹ️ Extract event data from event API
  const extractEventDataFromEventApi = (eventApi: EventApi) => {
    // @ts-expect-error EventApi has extendProps type Dictionary (Record<string, any>) and we have fully typed extended props => Type conflict
    const {
      id,
      title,
      start,
      end,
      url,
      allDay,
      extendedProps: {
        status,
        calendar,
        createdDate,
        userCreated,
        description,
        timeStart,
        timeEnd,
        templateId,
        template,
        totalPatients,
        totalSending,
        totalPending,
        totalNot,
        istart,
        iend,
      },
    }: Event = eventApi;

    return {
      id,
      title,
      start,
      end,
      url,
      allDay,
      extendedProps: {
        status,
        calendar,
        createdDate,
        userCreated,
        description,
        timeStart,
        timeEnd,
        templateId,
        template,
        totalPatients,
        totalSending,
        totalPending,
        totalNot,
        istart,
        iend,
      },
    };
  };

  // if (typeof process !== 'undefined' && process.server)
  //     store.fetchEvents()

  // 👉 Fetch events
  const fetchEvents: EventSourceFunc = (info, successCallback) => {
    if (!info) return;

    store
      .fetchEvents(info.startStr, info.endStr)
      .then((r) => {
        successCallback(
          r.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
            // id: String(e.id),
          }))
        );
      })
      .catch((e) => {
        console.error("Error occurred while fetching calendar events", e);
      });
  };

  // 👉 Calendar API
  const calendarApi = ref<null | CalendarApi>(null);

  // 👉 Update event in calendar [UI]
  const updateEventInCalendar = (
    updatedEventData: Event,
    propsToUpdate: (keyof Event)[],
    extendedPropsToUpdate: (keyof Event["extendedProps"])[]
  ) => {
    const existingEvent = calendarApi.value?.getEventById(
      String(updatedEventData.id)
    );

    if (!existingEvent) {
      console.warn("Can't found event in calendar to update");

      return;
    }

    // ---Set event properties except date related
    // dateRelatedProps => ['start', 'end', 'allDay']
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index];

      existingEvent.setProp(propName, updatedEventData[propName]);
    }

    // --- Set date related props
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, {
      allDay: updatedEventData.allDay,
    });

    // --- Set event's extendedProps
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index];

      existingEvent.setExtendedProp(
        propName,
        updatedEventData.extendedProps[propName]
      );
    }
  };

  // 👉 Remove event in calendar [UI]
  const removeEventInCalendar = (eventId: string) => {
    const _event = calendarApi.value?.getEventById(eventId);

    if (_event) _event.remove();
  };

  // 👉 refetch events
  const refetchEvents = () => {
    calendarApi.value?.refetchEvents();
  };

  watch(() => store.selectedCalendars, refetchEvents);

  // 👉 Update event
  const updateEvent = (_event: Event) => {
    const propsToUpdate = ["id", "title", "url"] as (keyof Event)[];
    const extendedPropsToUpdate = [
      "calendar",
      "deleted",
      "createdDate",
      "userCreated",
      "project",
      "description",
      "timeStart",
      "timeEnd",
      "templateId",
      "template",
      "totalPatients",
      "totalSending",
      "totalPending",
      "totalNot",
      "istart",
      "iend",
    ] as (keyof Event["extendedProps"])[];
    updateEventInCalendar(_event, propsToUpdate, extendedPropsToUpdate);
    refetchEvents();
  };

  // 👉 Calendar options
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    locale: esLocale,
    headerToolbar: {
      start: "prev,next today",
      // start: 'drawerToggler,today,prev,next',
      center: "title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    // slotLabelFormat: {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: false,
    // },
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
    dayMaxEvents: 4,

    dayHeaderFormat: { weekday: isMobile.value ? "short" : "long" },
    // dayHeaderFormat: { weekday: 'long' },

    /*Determines if day names and week names are clickable*/
    // <span>${DateTime.fromJSDate(event.start as Date).toFormat('hh a').toLowerCase()}</span>
    navLinks: false,
    eventContent(arg) {
      let event = arg.event;
      let customHtml = ` 
            <div style="white-space: nowrap;  overflow: hidden; text-overflow: ellipsis; cursor: pointer; color: #000"> 
            <span> ${event.extendedProps.status === 'Finalizado' ? '✅' : ''} ${event.extendedProps.timeStart} ${event.title}</span>
            </div> `;
      return { html: customHtml };
    },

    eventDidMount: function (info) {
      const colorName = store.availableCalendars.find(
        (v: any) => v.label === info.event.extendedProps.calendar
      )?.color;

      info.el.style.backgroundColor = colorName;
      // info.el.style.color = '#fff';
      const dot = info.el.querySelector(".fc-list-event-dot");
      if (dot instanceof HTMLElement) {
        dot.style.borderColor = colorName;
      }
    },

    //Show event
    eventClick({ event: clickedEvent, jsEvent }) {
      jsEvent.preventDefault();
      event.value = extractEventDataFromEventApi(clickedEvent);

      isDetailActive.value = true;

      // if (!isDetailActive.value && !isDetailActiveAnother.value) {
      // isDetailActive.value = true;
      // } else if (isDetailActive.value == true) {
      //   isDetailActiveAnother.value = true;
      // } else {
      //   isDetailActive.value = true;
      // }
    },

    // Add event
    dateClick(info) {
      if (!isDetailActive.value && !isDetailActiveAnother.value) {
        // const selectDate = dayjs(info.dateStr).startOf("day");
        // const currentDate = dayjs().startOf("day");

        event.value = {
          ...blankEvent,
          extendedProps: {
            ...blankEvent.extendedProps,
            istart: dayjs(info.date).format("YYYY-MM-DD"),
            iend: dayjs(info.date).format("YYYY-MM-DD"),
          }
        };

        isEventHandlerSidebarActive.value = true;
      }
    },

    datesSet: function () {
      let titleEl = document.querySelector(".fc-toolbar-title");
      if (titleEl instanceof HTMLElement) {
        titleEl.style.textTransform = "capitalize";
      }
    },

    /*Handle event resize*/
    eventResize({ event: resizedEvent }) {
      if (resizedEvent.start && resizedEvent.end)
        updateEvent(extractEventDataFromEventApi(resizedEvent));
    },

    customButtons: {
      drawerToggler: {
        text: "calendarDrawerToggler",
        // click() {
        //     isLeftSidebarOpen.value = true
        // },
      },
      today: {
        text: "Hoy",
        click() {
          date.value = new Date().toISOString().substr(0, 10);
          calendarApi.value?.gotoDate(new Date(date.value));
        },
      },
    },
  } as CalendarOptions;

  onMounted(() => {
    calendarApi.value = refCalendar.value.getApi();
  });

  const jumpToDate = (currentDate: string) => {
    calendarApi.value?.gotoDate(new Date(currentDate));
  };

  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    fetchEvents,
    updateEvent,
    removeEventInCalendar,
    jumpToDate,
  };
};
