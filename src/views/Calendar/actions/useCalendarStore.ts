// import calendarServices from "@/services/report/ess/calendar.services";
// import { authStores } from '@/stores/auth.stores';
import { defineStore } from 'pinia';
// import type { Event } from './types';

interface Categories {
    id: number
    label: string
    color: string
}

// let params = {
//     user: null,
//     startDate: "",
//     endDate: "",
//     categories: []
// };

// const useAuthStores = authStores();

export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        availableCalendars: [] as Categories[],
        selectedCalendars: <any>[],
    }),
    actions: {
        async fetchCategories() {
            this.selectedCalendars = [
                {
                    id: 1,
                    label: "Citas",
                    color: "#ff0000"
                },
                {
                    id: 2,
                    label: "Consultas",
                    color: "#d50000"
                },
                {
                    id: 3,
                    label: "Reuniones",
                    color: "#ed2300"
                },
                {
                    id: 4,
                    label: "Cumpleaños",
                    color: "#0d47a1"
                }
            ]

            this.selectedCalendars.map((item: any) => {
                this.selectedCalendars.push(item.id)
            })
            // const { data } = await calendarServices.getCategories(7)
            // console.log(data.data);

            // this.availableCalendars = data.data
            // data.data.map((item: any) => {
            //     this.selectedCalendars.push(item.id)
            // })
        },
        async fetchEvents(startDate: string, endDate: string) {
            console.log(startDate, endDate);

            // params.categories = this.selectedCalendars.length === this.availableCalendars.length ? [] : this.selectedCalendars
            // params.startDate = DateTime.fromISO(startDate).toFormat("yyyy-LL-dd HH:mm")
            // params.endDate = DateTime.fromISO(endDate).toFormat("yyyy-LL-dd HH:mm")
            // const { data } = await calendarServices.get(params)
            // console.log(data);

            // const formatData = data.map((item: any) => {
            //     return {
            //         id: item.id,
            //         title: item.nombre_tarea,
            //         start: item.fecha_hora_inicio,
            //         end: item.fecha_hora_fin,
            //         allDay: false,
            //         extendedProps: {
            //             state: item.estado == "1" ? true : false,
            //             calendar: item.categoria,
            //             categoryId: parseInt(item.id_categoria),
            //             place: item.lugar,
            //             createdDate: item.fecha_creacion,
            //             userCreated: item.creado_por,
            //             project: item.proyecto,
            //             description: item.descripcion,
            //             userLeadingName: item.nombre_lider,
            //             userLeading: item.usuario_lider,
            //             guests: JSON.parse(item.integrantes),
            //             deleted: JSON.parse(item.eliminados ?? '[]'),
            //         },
            //     }
            // })
            return [
                {
                    id: 1,
                    title: "Event 1",
                    start: "2025-01-17",
                    end: "2025-01-18",
                    allDay: false,
                    extendedProps: {
                        state: true,
                        calendar: "Citas",
                        categoryId: 1,
                        place: "Lugar 1",
                        createdDate: "2025-01-20",
                        userCreated: 1,
                        description: "Descripción 1",
                        guests: [
                            {
                                id: 1,
                                name: "Guest 1",
                                email: "guest1@example.com",
                            },
                            {
                                id: 2,
                                name: "Guest 2",
                                email: "guest2@example.com",
                            },
                        ],
                    },
                },
                {
                    id: 2,
                    title: "Event 2",
                    start: "2025-01-25",
                    end: "2025-01-25",
                    allDay: false,
                    extendedProps: {
                        state: false,
                        calendar: "Consultas",
                        categoryId: 2,
                        place: "Lugar 1",
                        createdDate: "2025-01-20",
                        userCreated: 1,
                        description: "Descripción 1",
                        guests: [
                            {
                                id: 1,
                                name: "Guest 1",
                                email: "guest1@example.com",
                            },
                            {
                                id: 2,
                                name: "Guest 2",
                                email: "guest2@example.com",
                            },
                        ],
                    }
                }
            ]
        },
        async removeEvent() {
            // eventId: number
            // const response = await calendarServices.delete(eventId);
            return []
        },
    },
    getters: {
        async getCategory(): Promise<Categories[]> {
            const store = this as unknown as ReturnType<typeof useCalendarStore>;
            if (store.availableCalendars.length === 0) { await store.fetchCategories(); }
            return store.availableCalendars;
        }
    },
})