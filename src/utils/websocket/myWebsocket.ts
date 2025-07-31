import { io } from "socket.io-client";
import { ref } from "vue";

const socket = io(import.meta.env.VITE_API_URL);

export default function mySocket() {
  const responseQR = ref<string>("");
  const responseReady = ref<string>("");

  // Respuesta del servidor
  socket.on("newQr", (data: string) => {
    responseQR.value = data;
  });

  socket.on("ready", (data: string) => {
    responseReady.value = data;
  });

  return {
    responseQR,
    responseReady,
  };
}
