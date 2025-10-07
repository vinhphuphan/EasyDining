export interface Employee {
  id: string
  name: string
  email: string
  pin: string
  role: "Waiter" | "Chef" | "Manager"
  avatar: string
  shiftStart: string
  shiftEnd: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  type: "Dine In" | "Take Away"
  status: "in-progress" | "ready" | "completed" | "waiting-payment"
  progress: number
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  tableNumber?: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  addOns?: { name: string; price: number }[]
  note?: string
}

export interface Table {
  id: string
  number: string
  floor: string
  capacity: number
  status: "available" | "occupied" | "reserved"
  currentOrderId?: string
}

export interface MenuItem {
  stockLevel: string
  id: string
  name: string
  category: string
  price: number
  image: string
  stockStatus: "available" | "not-available" | "out-of-stock"
  availableTime?: string
  description?: string
  addOns?: { name: string; price: number }[]
}

export interface Notification {
  id: string
  type: "inventory" | "kitchen" | "general"
  title: string
  message: string
  status: "unread" | "read"
  relatedEntity?: string
  createdAt: string
  actionLabel?: string
  icon?: string
}

export const employees: Employee[] = [
  {
    id: "1",
    name: "Richardo Wilson",
    email: "richardo.wilson@gmail.com",
    pin: "123456",
    role: "Waiter",
    avatar: "/professional-man.jpg",
    shiftStart: "10:00 AM",
    shiftEnd: "02:00 PM",
  },
  {
    id: "2",
    name: "Orlando",
    email: "orlando@easydining.com",
    pin: "234567",
    role: "Waiter",
    avatar: "/young-waiter.jpg",
    shiftStart: "02:00 PM",
    shiftEnd: "06:00 PM",
  },
  {
    id: "3",
    name: "Eve",
    email: "eve@easydining.com",
    pin: "345678",
    role: "Waiter",
    avatar: "/professional-woman-diverse.png",
    shiftStart: "06:00 PM",
    shiftEnd: "10:00 PM",
  },
]

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "DI008",
    customerId: "1",
    customerName: "Daniel",
    type: "Dine In",
    status: "in-progress",
    progress: 10,
    items: [
      { id: "1", name: "Burger", quantity: 2, price: 12.99 },
      { id: "2", name: "Fries", quantity: 2, price: 4.99 },
    ],
    totalAmount: 35.96,
    createdAt: "Mon, 17 Feb 03:43 PM",
    tableNumber: "A1",
  },
  {
    id: "2",
    orderNumber: "TA001",
    customerId: "2",
    customerName: "Vlona",
    type: "Take Away",
    status: "in-progress",
    progress: 60,
    items: [
      { id: "3", name: "Pizza", quantity: 1, price: 18.99 },
      { id: "4", name: "Salad", quantity: 1, price: 8.99 },
    ],
    totalAmount: 27.98,
    createdAt: "Mon, 17 Feb 02:56 PM",
  },
  {
    id: "3",
    orderNumber: "DI002",
    customerId: "3",
    customerName: "Daniel",
    type: "Dine In",
    status: "waiting-payment",
    progress: 100,
    items: [{ id: "5", name: "Steak", quantity: 1, price: 28.99 }],
    totalAmount: 28.99,
    createdAt: "Mon, 17 Feb 10:32 AM",
    tableNumber: "A4",
  },
  {
    id: "4",
    orderNumber: "DI001",
    customerId: "4",
    customerName: "Eve",
    type: "Dine In",
    status: "waiting-payment",
    progress: 100,
    items: [{ id: "6", name: "Pasta", quantity: 2, price: 15.99 }],
    totalAmount: 31.98,
    createdAt: "Mon, 17 Feb 10:24 AM",
    tableNumber: "B3",
  },
]

export const tables: Table[] = [
  { id: "1", number: "A1", floor: "First Floor", capacity: 2, status: "occupied", currentOrderId: "1" },
  { id: "2", number: "A2", floor: "First Floor", capacity: 4, status: "available" },
  { id: "3", number: "A3", floor: "First Floor", capacity: 2, status: "available" },
  { id: "4", number: "A4", floor: "First Floor", capacity: 6, status: "occupied", currentOrderId: "3" },
  { id: "5", number: "A5", floor: "First Floor", capacity: 4, status: "available" },
  { id: "6", number: "A6", floor: "First Floor", capacity: 2, status: "available" },
  { id: "7", number: "A7", floor: "First Floor", capacity: 4, status: "available" },
  { id: "8", number: "A8", floor: "First Floor", capacity: 2, status: "available" },
  { id: "9", number: "A15", floor: "First Floor", capacity: 6, status: "available" },
  { id: "10", number: "B1", floor: "Second Floor", capacity: 4, status: "available" },
  { id: "11", number: "B2", floor: "Second Floor", capacity: 2, status: "available" },
  { id: "12", number: "B3", floor: "Second Floor", capacity: 6, status: "occupied", currentOrderId: "4" },
]

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    category: "Chef Recommendation",
    price: 12.64,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Creamy butter chicken with spices, served with rice.",
    addOns: [
      { name: "Extra Rice", price: 3.0 },
      { name: "Naan Bread", price: 2.5 },
      { name: "Extra Sauce", price: 1.5 },
    ],
  },
  {
    id: "2",
    name: "Wagyu Steak",
    category: "Chef Recommendation",
    price: 31.17,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Savor our Wagyu Steak, rich in flavor and buttery texture.",
    addOns: [
      { name: "Garlic Butter", price: 4.0 },
      { name: "Grilled Vegetables", price: 5.0 },
      { name: "Mashed Potatoes", price: 4.5 },
    ],
  },
  {
    id: "3",
    name: "Pasta Bolognese",
    category: "Chef Recommendation",
    price: 23.5,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Delicious Pasta Bolognese made with fresh tomatoes, beef, and herbs.",
    addOns: [
      { name: "Extra Cheese", price: 2.0 },
      { name: "Garlic Bread", price: 3.5 },
      { name: "Parmesan", price: 2.5 },
    ],
  },
  {
    id: "4",
    name: "Lemon Butter Dory",
    category: "Chef Recommendation",
    price: 50.5,
    image: "https://images.unsplash.com/photo-1580959375944-0b7b9e170e78?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Zesty lemon butter sauce enhances the dory's rich flavor.",
    addOns: [
      { name: "Steamed Vegetables", price: 4.0 },
      { name: "Lemon Wedges", price: 1.0 },
      { name: "Tartar Sauce", price: 2.0 },
    ],
  },
  {
    id: "5",
    name: "Spicy Tuna Nachos",
    category: "Chef Recommendation",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
    stockStatus: "not-available",
    description: "Crispy nachos topped with spicy tuna, jalapeños, and avocado.",
  },
  {
    id: "6",
    name: "Banana Wrap",
    category: "Chef Recommendation",
    price: 25.0,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Delicious banana wrapped in a soft tortilla with honey.",
    addOns: [
      { name: "Honey Jam", price: 17.0 },
      { name: "Strawberry Jam", price: 12.0 },
      { name: "Vanilla Jam", price: 8.0 },
      { name: "Tiramisu Jam", price: 10.0 },
      { name: "Mango Jam", price: 11.0 },
    ],
  },
  {
    id: "7",
    name: "Tom Yum Soup",
    category: "Soup",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Spicy and sour Thai soup with shrimp and mushrooms.",
  },
  {
    id: "8",
    name: "Miso Soup",
    category: "Soup",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Traditional Japanese soup with tofu and seaweed.",
  },
  {
    id: "9",
    name: "Pad Thai",
    category: "Noodle",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Classic Thai stir-fried noodles with peanuts and lime.",
  },
  {
    id: "10",
    name: "Ramen",
    category: "Noodle",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Japanese noodle soup with pork, egg, and vegetables.",
  },
  {
    id: "11",
    name: "Fried Rice with Green Chili",
    category: "Rice",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Spicy fried rice with green chili and vegetables.",
    addOns: [
      { name: "Fried Egg", price: 2.0 },
      { name: "Extra Chicken", price: 5.0 },
      { name: "Prawn Crackers", price: 3.0 },
    ],
  },
  {
    id: "12",
    name: "Chicken Biryani",
    category: "Rice",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Aromatic rice dish with spiced chicken and herbs.",
  },
  {
    id: "13",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Warm chocolate cake with a molten center.",
  },
  {
    id: "14",
    name: "Tiramisu",
    category: "Dessert",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Classic Italian dessert with coffee and mascarpone.",
  },
  {
    id: "15",
    name: "Mango Smoothie",
    category: "Drink",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Refreshing mango smoothie with ice.",
  },
  {
    id: "16",
    name: "Jar Fruit Iced Tea",
    category: "Drink",
    price: 8.0,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    stockStatus: "available",
    description: "Refreshing iced tea with mixed fruits.",
  },
  {
    id: "17",
    name: "Hawaiian Chicken Skewers",
    category: "Main Course",
    price: 16.99,
    image: "/hawaiian-chicken-skewers.jpg",
    stockStatus: "out-of-stock",
    availableTime: "03:00 PM",
  },
  {
    id: "18",
    name: "BBQ Beef Ribs",
    category: "Main Course",
    price: 24.99,
    image: "/bbq-beef-ribs.jpg",
    stockStatus: "out-of-stock",
    availableTime: "04:30 PM",
  },
  {
    id: "19",
    name: "Veggie Supreme Pizza",
    category: "Pizza",
    price: 18.99,
    image: "/veggie-supreme-pizza.jpg",
    stockStatus: "out-of-stock",
    availableTime: "04:30 PM",
  },
  {
    id: "20",
    name: "Tacos With Chicken Grilled",
    category: "Mexican",
    price: 14.99,
    image: "/chicken-tacos.png",
    stockStatus: "out-of-stock",
    availableTime: "05:00 PM",
  },
]

export const notifications: Notification[] = [
  {
    id: "1",
    type: "inventory",
    title: "Low Stock Alert!",
    message: "The stock for Salmon Fillet is running low. Please reorder soon to avoid disruption.",
    status: "unread",
    relatedEntity: "Salmon Fillet",
    createdAt: "2 hours ago",
    actionLabel: "Request Ingredients",
    icon: "📦",
  },
  {
    id: "2",
    type: "kitchen",
    title: "Dish Ready to Serve!",
    message: "The kitchen has finished preparing Butter Chicken. Please serve it to the table A8 promptly.",
    status: "unread",
    relatedEntity: "Butter Chicken",
    createdAt: "5 minutes ago",
    icon: "👨‍🍳",
  },
  {
    id: "3",
    type: "kitchen",
    title: "Dish Ready to Serve!",
    message: "The kitchen has finished preparing Pasta Bolognese. Please serve it to the table B12 promptly.",
    status: "unread",
    relatedEntity: "Pasta Bolognese",
    createdAt: "8 minutes ago",
    icon: "👨‍🍳",
  },
  {
    id: "4",
    type: "inventory",
    title: "Low Stock Alert!",
    message: "The stock for Bok Choy is running low. Please reorder soon to avoid disruption.",
    status: "read",
    relatedEntity: "Bok Choy",
    createdAt: "1 day ago",
    actionLabel: "Already Request",
    icon: "📦",
  },
]
