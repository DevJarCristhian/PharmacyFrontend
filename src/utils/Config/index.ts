import { darkTheme, lightTheme } from "naive-ui";

const light = {
  common: {
    ...lightTheme.common,
    primaryColor: "#FFD100FF",
    primaryColorHover: "#FCD939FF",
    primaryColorPressed: "#D7B100FF",
    primaryColorSuppl: "#937E1FFF",
    borderRadius: "8px",
  },
  Menu: {
    itemColorActive: "#FFD100FF",
    itemColorActiveHover: "#FFD100FF",
    itemTextColorActive: "#FFFFFF",
    itemTextColorActiveHover: "#FFFFFF",
    itemIconColorActive: "#FFFFFF",
    itemIconColorActiveHover: "#FFFFFF",

    itemColorActiveCollapsed: "#FFD100FF",
    itemColorActiveHoverCollapsed: "#FFD100FF",

    itemTextColor: "#606060",
    itemIconColor: "#606060",

    itemIconColorCollapsed: "#606060",
    arrowColor: "#606060",

    // itemTextColorHover: "#FFD100FF",
    // itemIconColorHover: "#FFD100FF",
    // arrowColorHover: "#FFD100FF",
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
    borderRadius: "8px",
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
