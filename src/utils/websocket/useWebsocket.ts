import { ref } from "vue";
import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");
const socket = io("https://backendwha-production.up.railway.app");

export default function useSocket() {
  const newMessage = ref<any>();

  // Respuesta del servidor
  socket.on("MessageReceived", (data: string) => {
    newMessage.value = data;
  });

  // Enviar mensaje a través de WebSocket
  // const sendMessage = () => {
  //   socket.emit("sendMessage", {
  //     to: phoneNumber.value,
  //     message: message.value,
  //   });
  // };

  return {
    newMessage,
  };
}
