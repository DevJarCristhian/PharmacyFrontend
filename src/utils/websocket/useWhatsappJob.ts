import { ref } from "vue";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function useWhatsappJob() {
  const notify = ref<{ type: string; time: string }>({
    type: "",
    time: "",
  });

  const timeTest = ref<{ type: string; time: string }>({
    type: "Test de Hora",
    time: "00:00 00/00/0000",
  });

  // Respuesta del servidor
  socket.on("Notify", (data: string) => {
    notify.value = {
      type: data,
      time: new Date().toLocaleTimeString(),
    };
  });

  socket.on("test", (data: string) => {
    timeTest.value = {
      type: "Test de Hora",
      time: data,
    };
  });

  return {
    notify,
    timeTest,
  };
}
