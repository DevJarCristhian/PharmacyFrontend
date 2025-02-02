import { darkTheme, lightTheme } from "naive-ui";

const light = {
  common: {
    ...lightTheme.common,
    primaryColor: "#FFD100FF",
    primaryColorHover: "#FCD939FF",
    primaryColorPressed: "#D7B100FF",
    primaryColorSuppl: "#937E1FFF",
  },
  Menu: {
    itemTextColor: "#9FA9AD",
    itemTextColorHover: "#FFD100FF",
    itemIconColor: "#9FA9AD",
    itemIconColorHover: "#FFD100FF",
    itemIconColorCollapsed: "#9FA9AD",
    arrowColorHover: "#FFD100FF",
    arrowColor: "#9FA9AD",
  },
  Tooltip: {
    color: "#FFFFFF",
    textColor: "#000",
  },
  Form: {
    feedbackHeightMedium: "10px",
  },
};

const dark = {
  common: {
    ...darkTheme.common,
    primaryColor: "#FFD100FF",
    primaryColorHover: "#FCD939FF",
    primaryColorPressed: "#D7B100FF",
    primaryColorSuppl: "#937E1FFF",
    cardColor: "#1f2839",
    tableColor: "#1f2839",
    popoverColor: "#1f2839",
  },
  Dropdown: {
    color: "#1f2839",
  },
  Tooltip: {
    color: "#1f2839",
    textColor: "#FFFFFF",
  },
  Card: {
    colorModal: "#1f2839",
  },
  Form: {
    feedbackHeightMedium: "10px",
  },
};

export { light, dark };
