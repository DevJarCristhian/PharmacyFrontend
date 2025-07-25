export default [
  {
    label: "Dashboard",
    key: "dashboard",
    href: "/dashboard",
    i: "home",
  },
  {
    label: "Calendario",
    key: "calendar",
    href: "/calendar",
    i: "calendar",
  },
  {
    label: "Whatsapp",
    key: "whatsapp",
    i: "comunication",
    children: [
      {
        label: "Chats",
        key: "whatsapp",
        href: "/whatsapp",
      },
      {
        label: "Plantillas",
        key: "templates",
        href: "/templates",
      },
    ],
  },
  {
    label: "Ventas",
    key: "sales",
    i: "sale",
    children: [
      {
        label: "Oportunidades",
        key: "opportunities",
        href: "/opportunities",
      },
      {
        label: "Productos",
        key: "products",
        href: "/products",
      },
      {
        label: "Lista Precios",
        key: "prices",
        href: "/prices",
      },
    ],
  },
  {
    label: "Personas",
    key: "persons",
    i: "people",
    children: [
      {
        label: "Doctores",
        key: "doctors",
        href: "/doctors",
      },
      {
        label: "Pacientes",
        key: "patients",
        href: "/patients",
      },
      {
        label: "Visitadores",
        key: "visitors",
        href: "/visitors",
      },
      {
        label: "Dependientes",
        key: "dependents",
        href: "/dependents",
      },
    ],
  },
  {
    label: "Datos",
    key: "data",
    i: "pharmacy",
    children: [
      {
        label: "Farmacias",
        key: "pharmacies",
        href: "/pharmacies",
      },
      {
        label: "Cadenas",
        key: "chains",
        href: "/chains",
      },
      {
        label: "Instituciones",
        key: "institutions",
        href: "/institutions",
      },
    ],
  },
  {
    label: "Acessos",
    key: "access",
    i: "users",
    children: [
      {
        label: "Conexiones",
        key: "access",
        href: "/access",
      },
      {
        label: "Usuarios",
        key: "users",
        href: "/users",
      },
      {
        label: "Roles",
        key: "roles",
        href: "/roles",
      },
    ],
  },
  {
    label: "Ajustes",
    key: "settings",
    href: "/settings",
    i: "settings",
  },
];
