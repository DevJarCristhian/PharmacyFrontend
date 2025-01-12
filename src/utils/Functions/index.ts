import { h } from "vue";
import JIcon from "../../components/JIcon.vue";

export const renderIcon = (icon: string, size: string = "w-4") => {
  return () => {
    return h(JIcon, { name: icon, w: size });
  };
};

export const Formating = (icon: string, size: string = "w-4") => {
  return () => {
    return h(JIcon, { name: icon, w: size });
  };
};
