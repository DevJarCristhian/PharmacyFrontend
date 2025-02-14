<script setup lang="ts">
import { NScrollbar, NTag } from 'naive-ui';
import Bubble from './components/Bubble.vue';
import { ref, onMounted, watch, h } from 'vue';
import Message from './components/Message.vue';
import useSocket from '../../utils/websocket/useWebsocket';
import whatsappServices from '../../services/whatsapp/whatsapp.services';
import Contact from './components/Contact.vue';
const { newMessage } = useSocket();

const scrollbarContent = ref<InstanceType<typeof NScrollbar> | null>(null);
const innerContent = ref<HTMLElement | null>(null);
const message = ref('');
const contacts = ref<any>([]);
const chats = ref<any>();
const contactValues = ref<{
    contactId: number;
    name: string;
    profilePicUrl: string;
    lastMessage: string;
    lastMessageDate: string;
    messages: {
        id: number;
        body: string;
        ack: number;
        read: number;
        mediaType: string;
        mediaUrl?: string;
        fromMe?: number;
        isDelete?: string;
        createdAt?: string;
    }[];
}>({} as any);
const optionPatients = ref<any>([]);
const searchPatient = ref<any>("");

onMounted(() => {
    if (scrollbarContent.value && innerContent.value) {
        scrollbarContent.value.scrollTo({ top: innerContent.value.scrollHeight });
    }
    getChats();
    getContacts();
});

watch(newMessage, () => {
    addNewMessage(newMessage.value);
})

const getChat = (chat: any) => {
    contactValues.value = chat;
}

const addNewMessage = (message: any) => {
    let verifyExist = false;
    chats.value.forEach((chat: any) => {
        if (chat.contactId === message.contactId) {
            verifyExist = true;
            chat.lastMessage = message.body;
            chat.lastMessageDate = message.createdAt;
            chat.messages.push(message);
        }
    })

    if (!verifyExist) {
        let newMessage = {
            contactId: message.contactId,
            lastMessage: message.body,
            lastMessageDate: message.createdAt,
            name: message.name,
            profilePicUrl: message.profilePicUrl,
            messages: [message]
        }
        chats.value.push(newMessage);
    }
}

const getChats = async () => {
    const response = await whatsappServices.getMessages()
    // console.log(response);
    chats.value = response
}

const getContacts = async () => {
    const response = await whatsappServices.getContacts()
    // console.log(response);
    contacts.value = response
}

const selectedPatient = ref<any>();

const selectPatient = async (value) => {
    const patt = await optionPatients.value.find((v: any) => v.value == value);
    // console.log(patt);
    selectedPatient.value = patt;
};

const customerSearch = async (search: string) => {
    if (search !== null && search.length > 1) {
        const response = await whatsappServices.getPatients(search)
        optionPatients.value = response;
    }
    if (search == "") {
        selectedPatient.value = null;
        searchPatient.value = "";
    }
};

const handleSendMessage = () => {
    console.log('Sending message...');
};

const renderLabel = (option: any) => {
    return [
        h(
            "div",
            { class: "mt-1 mb-1" },
            {
                default: () => [
                    h(
                        "div",
                        { class: "flex", style: "margin-bottom:-2px;" },
                        [
                            h("div", { class: "mr-2" }, { default: () => option.label }),
                            h(
                                NTag,
                                { size: "small", type: option.gender == 2 ? "error" : "success" },
                                { default: () => option.gender == 2 ? "Mujer" : "Hombre" }
                            )
                        ]
                    ),
                    h(
                        "div",
                        { style: "font-size: 12px; opacity: 0.7;" },
                        { default: () => `Celular ${option.value} -  DPI ${option.documentNumber}` }
                    ),
                ],
            }
        ),
    ];
};</script>

<template>
    <div class="flex-grow gap-2 w-full bg-white dark:bg-gray-900 shadow rounded-md h-[89vh] overflow-hidden flex">

        <div class="flex border dark:border-slate-700 rounded-lg">
            <div class="md:w-96">
                <div class="w-full grid h-14 px-4 mt-2">
                    <div class="flex justify-between items-center gap-2">
                        <n-auto-complete placeholder="Buscar paciente" v-model:value="searchPatient"
                            :render-label="renderLabel" @update:value="customerSearch" @select="selectPatient" clearable
                            :options="optionPatients">
                            <template #prefix>
                                <n-icon>
                                    <j-icon w="w-[14px]" name="search" />
                                </n-icon>
                            </template>
                        </n-auto-complete>
                    </div>
                </div>

                <n-tabs type="segment" animated>
                    <n-tab-pane name="chats" tab="Chats" class="scrollbar overflow-y-auto h-[calc(86vh-5.7rem)] -mt-2">
                        <Message v-for="item in chats" :key="item.id" :count="item.messages.length"
                            :message="item.lastMessage" :timestamp="item.lastMessageDate" :avatar="item.profilePicUrl"
                            :name="item.name" :status="false" @click="getChat(item)" />
                    </n-tab-pane>

                    <n-tab-pane name="contacts" tab="Contactos"
                        class="scrollbar overflow-y-auto h-[calc(86vh-5.7rem)]  -mt-2">
                        <Contact v-for="item in contacts" :key="item.id" :number="item.number"
                            :profilePicUrl="item.profilePicUrl" :name="item.name" />
                    </n-tab-pane>
                </n-tabs>
            </div>
        </div>

        <div class="w-full">
            <div v-if="contactValues.contactId" class="flex flex-col h-full">
                <div class="w-full grid border-b dark:border-slate-700 h-16 px-3">
                    <div class="flex justify-between items-center gap-2">
                        <div class="flex items-center gap-3">
                            <img v-if="contactValues.profilePicUrl" class="w-10 h-10 rounded-full" alt="Profile"
                                :src="contactValues.profilePicUrl" />
                            <j-icon v-else w="w-[41px]" name="userDefault" />

                            <div class="flex flex-col -space-y-1">
                                <span class="text-lg">{{ contactValues.name }}</span>
                                <!-- <span class="text-xs opacity-85">Online</span> -->
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <div
                                class="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out transform active:scale-90 hover:bg-gray-200/80 dark:hover:bg-zinc-800/80 h-8 w-8 rounded-lg">
                                <j-icon w="w-[20px]" name="search" />
                            </div>

                            <div
                                class="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out transform active:scale-90 hover:bg-gray-200/80 dark:hover:bg-zinc-800/80 h-8 w-8 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em"
                                    viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M12 3a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-2 9a2 2 0 1 1 4 0a2 2 0 0 1-4 0m0 7a2 2 0 1 1 4 0a2 2 0 0 1-4 0">
                                    </path>
                                </svg>
                            </div>
                        </div>

                    </div>
                </div>

                <n-scrollbar ref="scrollbarContent" class="px-3 mt-1">
                    <div ref="innerContent">
                        <p v-for="(item, index) in contactValues.messages" :key="index">
                            <Bubble :message="item.body" :sender="item.fromMe == 0 ? 'bot' : 'user'"
                                :timestamp="item.createdAt" />

                            <!-- <Bubble
                                message="I need some information about your services. about your services. about your service about your service."
                                sender="user" timestamp="05:15 PM" :status="true" /> -->
                        </p>
                    </div>
                </n-scrollbar>

                <div class="flex items-center gap-1 w-full h-16 py-3 px-1 border-t dark:border-slate-700">
                    <div
                        class="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out transform active:scale-90 hover:bg-gray-200/80 dark:hover:bg-zinc-800/80 h-8 w-10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M11.5 12.5h-5q-.213 0-.356-.144T6 11.999t.144-.356t.356-.143h5v-5q0-.213.144-.356T12.001 6t.356.144t.143.356v5h5q.213 0 .356.144t.144.357t-.144.356t-.356.143h-5v5q0 .213-.144.356t-.357.144t-.356-.144t-.143-.356z">
                            </path>
                        </svg>
                    </div>

                    <input type="text" v-model="message" id="default-search" class="block w-full pl-2 py-2 text-sm font-normal 
            shadow-xs dark:text-gray-200 bg-transparent border border-gray-300 dark:border-slate-700 rounded-lg
             placeholder-gray-500 focus:outline-none  leading-relaxed" placeholder="Escribe el mensaje" />
                    <!-- focus:outline-none -->

                    <div @click="handleSendMessage"
                        class="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out transform active:scale-90 hover:bg-gray-200/80 dark:hover:bg-zinc-800/80 h-8 w-10 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M14.76 12H6.832m0 0c0-.275-.057-.55-.17-.808L4.285 5.814c-.76-1.72 1.058-3.442 2.734-2.591L20.8 10.217c1.46.74 1.46 2.826 0 3.566L7.02 20.777c-1.677.851-3.495-.872-2.735-2.591l2.375-5.378A2 2 0 0 0 6.83 12">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>

            <div v-else class="flex flex-col gap-2 w-full h-full items-center justify-center">
                <span>Seleccione un Chat o busque</span>
                <span>un paciente o contacto</span>
                <span>para iniciar una nueva comunicación</span>
                <j-icon w="w-[60px]" name="comunication" />
            </div>
        </div>
    </div>
</template>