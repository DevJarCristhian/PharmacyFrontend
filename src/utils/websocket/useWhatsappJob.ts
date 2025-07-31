import { ref } from "vue";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function useWhatsappJob() {
  const notify = ref<{ type: string; time: string }>({
    type: "",
    time: "",
  });

  // Respuesta del servidor
  socket.on("Notify", (data: string) => {
    notify.value = {
      type: data,
      time: new Date().toLocaleTimeString(),
    };
  });

  return {
    notify,
  };
}
