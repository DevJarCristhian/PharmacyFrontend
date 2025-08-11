<script setup lang="ts">
import { NScrollbar, useMessage } from 'naive-ui';
import Bubble from './components/Bubble.vue';
import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
import Message from './components/Message.vue';
import useSocket from '../../../utils/websocket/useWebsocket';
import whatsappServices from '../../../services/whatsapp/whatsapp.services';
import { GetMessageDefault, StoreMessage } from '../../../services/interfaces/whatsapp/whatsapp.interfaces';
import { useCalendarStore } from '../../../views/Calendar/actions/useCalendarStore';

import dayjs from 'dayjs';
const { newMessage } = useSocket();

const sendModal = defineAsyncComponent(() => import('./components/SendMessage.vue'))

const message = useMessage()
const storeCal = useCalendarStore()
const scrollbarContent = ref<InstanceType<typeof NScrollbar> | null>(null);
const innerContent = ref<HTMLElement | null>(null);
const contacts = ref<any>([])
const chats = ref<any>();
const URLIMG = ref<any>(null)
const showSend = ref<boolean>(false)
const loadingImg = ref<boolean>(false)
const loadingM = ref<boolean>(false)
const contactValues = ref<GetMessageDefault>({} as GetMessageDefault);
const optionPatients = ref<any>([]);

const valuesSend = ref<StoreMessage>({
    number: '',
    message: '',
    contactId: 0,
    mediaType: 'chat',
    file: null
})
const params = ref<{
    search: string;
    page: number;
    perPage: number;
}>({
    search: '',
    page: 1,
    perPage: 20
});
const pagination = ref<{ total: number, lastPage: number }>(
    { total: 0, lastPage: 1 }
)

onMounted(() => {
    getChats();
    // getContacts();
});

watch(newMessage, () => {
    addNewMessage(newMessage.value);
})

const getChat = async (chat: GetMessageDefault) => {
    contactValues.value = chat;
    valuesSend.value.contactId = chat.contactId;
    valuesSend.value.number = chat.number;
    valuesSend.value.mediaType = "chat";

    const response = await whatsappServices.getChat(chat.contactId);
    // console.log(response);
    contactValues.value.messages = response

    // console.log(chat);
    setTimeout(() => {
        scrollbarContent.value?.scrollTo({ top: innerContent.value?.scrollHeight });
    }, 150)
}

const addNewMessage = (message: any) => {
    let verifyExist = false;
    chats.value.forEach((chat: any) => {
        if (chat.contactId === message.contactId) {
            verifyExist = true;
            chat.lastMessage = message.body;
            chat.lastMessageDate = message.createdAt;
            chat.mediaType = message.mediaType;
            chat.fromMe = message.fromMe;
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
            mediaType: message.mediaType,
            fromMe: message.fromMe,
            messages: [message]
        }
        chats.value.push(newMessage);
    }

    if (message.contactId === valuesSend.value.contactId) {
        setTimeout(() => {
            scrollbarContent.value?.scrollTo({ top: innerContent.value?.scrollHeight });
        }, 100)
    }
}

const getChats = async () => {
    const response = await whatsappServices.getMessages(params.value);
    chats.value = response.data
    pagination.value.total = response.total
    pagination.value.lastPage = response.last_page
    // console.log(response);
}

const loadingMore = async () => {
    params.value.page += 1
    loadingM.value = true;
    const response = await whatsappServices.getMessages(params.value);
    // console.log(response);
    chats.value = chats.value.concat(response.data)
    loadingM.value = false;
}

const getContacts = async () => {
    const response = await whatsappServices.getContacts()
    // console.log(response);
    contacts.value = response
}

const addMessage = (values: StoreMessage, file: boolean) => {
    contactValues.value.lastMessage = values.message;
    contactValues.value.lastMessageDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    contactValues.value.mediaType = file ? 'image' : 'chat';
    contactValues.value.fromMe = 1;
    contactValues.value.messages.push({
        body: values.message,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        fromMe: 1,
        id: 0,
        mediaType: 'chat',
        read: 0,
        ack: 1,
    })
}

const sendMessage = async (values: StoreMessage) => {
    if (values.message.trim() !== '' || values.file) {
        if (values.file) {
            loadingImg.value = true;
        }

        const response = await whatsappServices.sendMessage(valuesSend.value)
        console.log(response);
        if (response !== 'error') {
            addMessage(values, values.file ? true : false);
            valuesSend.value.message = '';

            setTimeout(() => {
                scrollbarContent.value?.scrollTo({ top: innerContent.value?.scrollHeight });
                clearImage();
                loadingImg.value = false;
            }, 200)
        } else {
            message.warning("Error al enviar el mensaje.");
            clearImage();
            loadingImg.value = false;
        }
    }
}

const beforeUpload = async ({ file }) => {
    if (file.file.type == "image/png" || file.file.type == "image/jpg" || file.file.type == "image/jpeg") {
        URLIMG.value = URL.createObjectURL(file.file);
        valuesSend.value.file = file.file
        return true;
    }
    message.error("El archivo necesita ser una Imagen.");
    return false;
}

const clearImage = () => {
    URLIMG.value = null
    valuesSend.value.file = null
}

</script>

<template>
    <div class="flex-grow gap-2 w-full bg-white dark:bg-gray-900 shadow rounded-md h-[89vh] overflow-hidden flex">
        <sendModal :show="showSend" @close="showSend = !showSend" @refresh="getChats(), getContacts()" />

        <div class="flex border dark:border-slate-700 rounded-lg">
            <div class="md:w-96">
                <div class="w-full grid h-14 px-4">
                    <div class="flex justify-between items-center gap-2">
                        <n-auto-complete placeholder="Buscar" v-model:value="params.search" clearable
                            :options="optionPatients" @keydown.enter="getChats()">
                            <template #prefix>
                                <n-icon>
                                    <j-icon w="w-[14px]" name="search" />
                                </n-icon>
                            </template>
                        </n-auto-complete>

                        <n-button size="small" type="primary"
                            :disabled="storeCal.activeWhatsapp === 'Conectado' ? false : true" @click="showSend = true">
                            <j-icon w="w-[20px]" name="people" />
                            Campaña
                        </n-button>
                    </div>
                </div>

                <n-scrollbar ref="scrollbarChats">
                    <Message v-for="item in chats" :key="item.id" :message="item.lastMessage" :fromMe="item.fromMe"
                        :count="item.fromMe == 1 ? undefined : 1" :timestamp="item.lastMessageDate"
                        :avatar="item.profilePicUrl" :name="item.name" :mediaType="item.mediaType"
                        @click="getChat(item)" />


                    <div class="flex items-center justify-center w-full h-8 px-3">
                        <n-button v-if="pagination.total > 2 && pagination.lastPage !== params.page" :loading="loadingM"
                            size="small" secondary @click="loadingMore" round>
                            Mostrar más
                        </n-button>
                    </div>
                </n-scrollbar>
                <!-- <pre>{{ JSON.stringify(valuesSend, null, 2) }}</pre> -->
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
                                <span class="text-lg font-medium">{{ contactValues.name }}</span>
                                <!-- <span class="text-xs opacity-85">Online</span> -->
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <!-- <div
                                class="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out transform active:scale-90 hover:bg-gray-200/80 dark:hover:bg-zinc-800/80 h-8 w-8 rounded-lg">
                                <j-icon w="w-[20px]" name="search" />
                            </div> -->

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

                <n-scrollbar ref="scrollbarContent" class="background-div">
                    <div ref="innerContent" class="mt-1 px-3">
                        <p v-for="(item, index) in contactValues.messages" :key="index">
                            <Bubble v-if="item" :message="item.body" :sender="item.fromMe === 0 ? 'bot' : 'user'"
                                :timestamp="item.createdAt" :status="false" :img="item.mediaUrl"
                                :loading="loadingImg" />
                        </p>
                    </div>
                </n-scrollbar>

                <div class="flex items-center gap-2 w-full h-16 py-3 px-4 border-t dark:border-slate-700">
                    <div v-if="URLIMG"
                        class="flex items-center justify-center w-52 h-52 rounded-r-lg overflow-hidden bg-white dark:bg-gray-900 absolute -mt-64 -ml-4">
                        <n-image width="192" :src="URLIMG" preview-disabled />
                    </div>

                    <div v-if="storeCal.activeWhatsapp === 'Conectado'">
                        <n-upload v-if="!URLIMG" @before-upload="beforeUpload" :max="1" :show-file-list="false"
                            class="w-11">
                            <n-button secondary circle size="large">
                                <template #icon>
                                    <n-icon><j-icon w="w-[20px]" name="img" /></n-icon>
                                </template>
                            </n-button>
                        </n-upload>

                        <n-button v-else tertiary type="error" circle size="large" @click="clearImage">
                            <template #icon>
                                <n-icon><j-icon w="w-[20px]" name="delete" /></n-icon>
                            </template>
                        </n-button>
                    </div>

                    <n-input placeholder="Escribe el mensaje" v-model:value="valuesSend.message"
                        @keydown.enter="sendMessage(valuesSend)"
                        :disabled="storeCal.activeWhatsapp === 'Conectado' ? false : true" />

                    <div v-if="storeCal.activeWhatsapp === 'Conectado'">
                        <div v-if="valuesSend.message.trim() !== '' || URLIMG" @click="sendMessage(valuesSend)"
                            class="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out transform active:scale-90 bg-gray-200/50 dark:bg-zinc-800/80 text-yellow-400 h-10 w-14 rounded-lg">
                            <j-icon w="w-[20px]" name="send" />
                        </div>
                        <div v-else class="flex items-center justify-center h-10 w-14 opacity-45">
                            <j-icon w="w-[20px]" name="sendiabled" />
                        </div>
                    </div>

                </div>
            </div>

            <div v-else class="flex flex-col gap-2 w-full h-full items-center justify-center">
                <span>Seleccione un Chat o busque</span>
                <span>un paciente o contacto</span>
                <span>para iniciar una nueva comunicación</span>
                <j-icon w="w-[60px] opacity-70" name="comunication" />
            </div>
        </div>
    </div>
</template>

<style>
.background-div {
    width: 100%;
    height: 100%;
    background-image: url('../../../assets/wbackground.png');
    background-repeat: repeat;
    background-size: 450px;
}
</style>