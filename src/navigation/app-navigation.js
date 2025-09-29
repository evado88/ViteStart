export const navigation = [
  {
    key: "home",
    text: "Home",
    icon: "fa fa-home",
    path: "/",
    items: [],
  },
  {
    key: "savings",
    text: "Savings",
    icon: "fa fa-life-saver",
    items: [
      {
        key: "post-savings",
        text: "Monthly Posting",
        path: "/contact",
        items: [],
      },
      {
        key: "savings",
        text: "My Savings",
        path: "/about",
        items: [],
      },
    ],
  },
  {
    key: "loan",
    text: "Loans",
    icon: "fa fa-credit-card",
    items: [
      {
        key: "loan-application",
        text: "Loan Application",
        path: "/home",
        items: [],
      },
      {
        key: "my-loans",
        text: "My loans",
        path: "/contactt",
        items: [],
      },
    ],
  },
  {
    key: "messenger",
    text: "Shares",
    icon: "fa fa-money",
    items: [
      {
        key: "post-shares",
        text: "Monthly Posting",
        path: "/phones",
        items: [],
      },
      {
        key: "my-shares",
        text: "My Shares",
        path: "/last-seen",
        items: [],
      },
    ],
  },
];
