import { h } from "vue";
import JIcon from "../../components/JIcon.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const renderIcon = (icon: string, size: string = "w-4") => {
  return () => {
    return h(JIcon, { name: icon, w: size });
  };
};

export const downloadExcel = async (data: any, filename: string) => {
  const dateNow = dayjs().format("YYYY-MM-DD HH-mm");
  const url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", `${filename} ${dateNow}.xlsx`);
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const formatDateLarge = (date: string, type: string = "large") => {
  if (!date || !dayjs(date).isValid()) {
    return "-";
  }

  if (type === "large") {
    return dayjs(date).format("YYYY-MM-DD HH:mm");
  } else {
    return dayjs(date).format("YYYY-MM-DD");
  }
};

export const formatDateLa = (date: string, type: string = "large") => {
  if (!date || !dayjs(date).isValid()) {
    return null;
  }

  if (type === "large") {
    return dayjs.utc(date).format("YYYY-MM-DD HH:mm");
  } else {
    return dayjs.utc(date).format("YYYY-MM-DD");
  }
};
