import { ref } from "vue";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function useSocket() {
  const newMessage = ref<any>();
  const responseQR = ref<string>("");
  const responseStatus = ref<string>("");
  const responseFail = ref<string>("");
  const notify = ref<{ type: string; time: string }>({
    type: "",
    time: "",
  });
  const timeTest = ref<{ type: string; time: string }>({
    type: "Test de Hora",
    time: "00:00 00/00/0000",
  });

  // Response Notify
  socket.on("Notify", (data: string) => {
    notify.value = {
      type: data,
      time: new Date().toLocaleTimeString(),
    };
  });

  // Response Test
  socket.on("test", (data: string) => {
    timeTest.value = {
      type: "Test de Hora",
      time: data,
    };
  });

  // Response from Whatsapp server
  socket.on("MessageReceived", (data: string) => {
    newMessage.value = data;
  });

  // Response RQ and Status whatsapp
  socket.on("newQr", (data: string) => {
    responseQR.value = data;
  });

  socket.on("status", (data: string) => {
    responseStatus.value = data;
  });

  return {
    notify,
    timeTest,
    newMessage,
    responseQR,
    responseStatus,
    responseFail,
  };
}
