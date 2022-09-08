const address = [
  {
    location: "23 Main Street, San Francisco, CA 94105",
    other: "Suite #2",
    id: 1,
  },
  {
    location: "44 Other Street, Berkeley, CA 83939",
    other: "Suite #2",
    id: 2,
  },
];

const payment = [
  { lastFour: "Ends in 1056", expiry: "01/22", id: 1 },
  { lastFour: "Ends in 8888", expiry: "04/12", id: 2 },
];

const orders = [
  {
    key: "1",
    date: "24 Apr 2020",
    venue: "Brooklyn Kitchen",
    amount: 101.35,
    newOrder: "brooklyn-kitchen",
  },
  {
    key: "2",
    date: "15 Apr 2020",
    venue: "Sundays Kitchen",
    amount: 55.05,
    newOrder: "sundays-kitchen",
  },
  {
    key: "3",
    date: "17 Mar 2020",
    venue: "Knives over Forks",
    amount: 16.96,
    newOrder: "knives-over-forks",
  },
];

const user = {
  orders,
  address,
  payment,
};

const menuItems = [
  {
    key: "1",
    title: "The Manor",
    description:
      "Decadent Jarlsberg and Arugula Paste in a mélange of Milk Cheese Cookies",
    ingredients: "rubbed eggplant, sublimated water bombs",
    price: 1950,
    serves: "1",
    allergies: ["lupens", "honey"],
    additions: ["White Rice", "Brown Rice"],
  },
  {
    key: "2",
    title: "Putanesca",
    description: "Lorem Ipsum dolor sit amet",
    ingredients: "rubbed eggplant, sublimated water bombs",
    price: 1050,
    serves: "5 - 8",
    allergies: ["lupens", "honey"],
    additions: ["White Rice", "Brown Rice"],
  },
  {
    key: "3",
    title: "Putanesca",
    description: "Lorem Ipsum dolor sit amet",
    ingredients: "rubbed eggplant, sublimated water bombs",
    price: 1050,
    serves: "5 - 8",
    allergies: ["lupens", "honey"],
    additions: ["White Rice", "Brown Rice"],
  },
];
export const venue = {
  title: "Danville Harvest",
  address: "500 Hartz Avenue, Danville CA, 94526",
  menu: menuItems,
  phone: "925-362-3665",
  bannerImageUrl:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
  collectiveDays: [
    {
      day: "Weekends",
      hours: "8:00 AM - 3:00 PM",
    },
    {
      day: "Weekdays",
      hours: "10:00 AM - 7:00 PM",
    },
  ],
  singularDays: [
    {
      day: "Sunday",
      hours: "8:00 AM - 3:00 PM",
      end: "15:00",
      start: "8:00",
    },
    {
      day: "Monday",
      hours: "10:00 AM - 7:00 PM",
      end: "19:00",
      start: "10:00",
    },
    {
      day: "Tuesday",
      hours: "10:00 AM - 7:00 PM",
      end: "19:00",
      start: "10:00",
    },
    {
      day: "Wednesday",
      hours: "10:00 AM - 7:00 PM",
      end: "19:00",
      start: "10:00",
    },
    {
      day: "Thursday",
      hours: "10:00 AM - 7:00 PM",
      end: "19:00",
      start: "10:00",
    },
    {
      day: "Friday",
      hours: "10:00 AM - 7:00 PM",
      end: "19:00",
      start: "10:00",
    },
    {
      day: "Saturday",
      hours: "8:00 AM - 3:00 PM",
      end: "15:00",
      start: "8:00",
    },
  ],
};
export default user;
