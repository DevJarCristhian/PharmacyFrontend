import { ref } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
// const socket = io("https://backendwha-production.up.railway.app");

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
