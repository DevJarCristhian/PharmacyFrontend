import { ref } from "vue";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
// const socket = io("https://backendwha-production.up.railway.app");

export default function useWhatsappJob() {
  const notify = ref<{ message: string; time: string }>({
    message: "",
    time: "",
  });

  // Respuesta del servidor
  socket.on("calendarJob", (data: string) => {
    notify.value = {
      message: data,
      time: new Date().toLocaleTimeString(),
    };
  });

  return {
    notify,
  };
}
