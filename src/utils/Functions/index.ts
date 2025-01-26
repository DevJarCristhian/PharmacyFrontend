import { h } from "vue";
import JIcon from "../../components/JIcon.vue";
import dayjs from "dayjs";

export const renderIcon = (icon: string, size: string = "w-4") => {
  return () => {
    return h(JIcon, { name: icon, w: size });
  };
};

export const downloadExcel = async (data: any, filename: string) => {
  const dateNow = dayjs().format('YYYY-MM-DD HH-mm');
  const url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute("download", `${filename} ${dateNow}.xlsx`);
  document.body.appendChild(a);
  a.click();
}

export const formatDate = (date: string) => {
  if (!date || !dayjs(date).isValid()) { return '-'; }
  return dayjs(date).format('YYYY/MM/DD')
}