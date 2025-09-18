export const navigation = [
  {
    key: "home",
    text: "Home",
    icon: 'fa fa-home',
    path: "/",
    items: [],
  },
  {
    key: "administration",
    text: "Administration",
    icon: 'fa fa-cubes',
    items: [
      {
        key: "about",
        text: "About",
        path: "/about",
        items: [],
      },
      {
        key: "contact",
        text: "Contact",
        path: "/contact",
        items: [],
      },
    ],
  },
  {
    key: "main",
    text: "Twyshe Main App",
    icon: 'fa fa-gear',
    items: [
      {
        key: "dashboard",
        text: "Dashboard",
        path: "/dashboard",
        items: [],
      },
      {
        key: "home2",
        text: "Home2",
        path: "/home2",
        items: [],
      },
    ],
  },
  {
    key: "messenger",
    text: "Twyshe Messenger",
    icon: "fa fa-send",
    items: [
      {
        key: "phone",
        text: "Phones",
        path: "/phones",
        items: [],
      },
      {
        key: "lastSeen",
        text: "Last Seen",
        path: "/last-seen",
        items: [],
      },
      {
        key: "dicussion",
        text: "Discussions",
        path: "/discussions",
        items: [],
      },
      {
        key: "conversation",
        text: "Conversations",
        path: "/conversations",
        items: [],
      },
    ],
  },
];
