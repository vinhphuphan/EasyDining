// ============================================
// MENU DATA CONFIGURATION
// ============================================
// This file contains all menu items and categories
// for the restaurant ordering system

/**
 * MenuItem interface defines the structure of each menu item
 */
export interface MenuItem {
  id: string
  name: string
  nameKo: string
  price: number
  image: string
  category: string
  description?: string
  options?: {
    flavors?: { name: string; price: number }[]
    sizes?: { name: string; price: number }[]
  }
  // Badges / tags for UI highlights
  isBest?: boolean
  isVeg?: boolean
  isSpicy?: boolean
}

/**
 * Available menu categories
 * These appear in the navigation bar
 */
export const menuCategories = [
  "Chef Recommendation",
  "Soup",
  "Noodle",
  "Rice",
  "Main Course",
  "Pizza",
  "Mexican",
  "Dessert",
  "Drink",
]

/**
 * Complete menu items list
 * Each item includes name, price, image, category, and optional customizations
 */
export const menuItems: MenuItem[] = [
  // ========== Chef Recommendations ==========
  {
    id: "1",
    name: "Butter Chicken",
    nameKo: "",
    price: 12.64,
    category: "Chef Recommendation",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    description: "Creamy butter chicken with spices, served with rice.",
    isBest: true,
  },
  {
    id: "2",
    name: "Wagyu Steak",
    nameKo: "",
    price: 31.17,
    category: "Chef Recommendation",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
    description: "Savor our Wagyu Steak, rich in flavor and buttery texture.",
  },
  {
    id: "3",
    name: "Pasta Bolognese",
    nameKo: "",
    price: 23.5,
    category: "Chef Recommendation",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
    description: "Delicious Pasta Bolognese made with fresh tomatoes, beef, and herbs.",
  },
  {
    id: "4",
    name: "Lemon Butter Dory",
    nameKo: "",
    price: 50.5,
    category: "Chef Recommendation",
    image:
      "https://i.ytimg.com/vi/JhBqY1Z2Jb4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA9cQb65y87bVmiRxFhDB9cGAG_og",
    description: "Zesty lemon butter sauce enhances the dory's rich flavor.",
  },
  {
    id: "5",
    name: "Spicy Tuna Nachos",
    nameKo: "",
    price: 18.99,
    category: "Chef Recommendation",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
    description: "Crispy nachos topped with spicy tuna, jalapeños, and avocado.",
    isSpicy: true,
  },
  {
    id: "6",
    name: "Banana Wrap",
    nameKo: "",
    price: 25.0,
    category: "Chef Recommendation",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
    description: "Delicious banana wrapped in a soft tortilla with honey.",
    isVeg: true,
  },

  // ========== Soups ==========
  {
    id: "7",
    name: "Tom Yum Soup",
    nameKo: "",
    price: 8.99,
    category: "Soup",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    description: "Spicy and sour Thai soup with shrimp and mushrooms.",
  },
  {
    id: "8",
    name: "Miso Soup",
    nameKo: "",
    price: 5.99,
    category: "Soup",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
    description: "Traditional Japanese soup with tofu and seaweed.",
  },

  // ========== Noodles ==========
  {
    id: "9",
    name: "Pad Thai",
    nameKo: "",
    price: 14.99,
    category: "Noodle",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
    description: "Classic Thai stir-fried noodles with peanuts and lime.",
  },
  {
    id: "10",
    name: "Ramen",
    nameKo: "",
    price: 16.99,
    category: "Noodle",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    description: "Japanese noodle soup with pork, egg, and vegetables.",
  },

  // ========== Rice Dishes ==========
  {
    id: "11",
    name: "Fried Rice with Green Chili",
    nameKo: "",
    price: 45.99,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    description: "Spicy fried rice with green chili and vegetables.",
    isSpicy: true,
  },
  {
    id: "12",
    name: "Chicken Biryani",
    nameKo: "",
    price: 18.99,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    description: "Aromatic rice dish with spiced chicken and herbs.",
  },

  // ========== Main Courses ==========
  {
    id: "17",
    name: "Hawaiian Chicken Skewers",
    nameKo: "",
    price: 16.99,
    category: "Main Course",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShoNVuXZR8YNIuymib6hnUUvfGAC0lb_xiwA&s",
    description: "Grilled chicken skewers with pineapple and peppers.",
  },
  {
    id: "18",
    name: "BBQ Beef Ribs",
    nameKo: "",
    price: 24.99,
    category: "Main Course",
    image:
      "https://www.foodandwine.com/thmb/3vphgXNFQ1yI_Qv7b2pFXJYw5zo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/200609-r-xl-sticky-barbecued-beef-ribs-2000-7f29a1d0eeed49159a7cc7479d12e700.jpg",
    description: "Tender BBQ beef ribs with smoky sauce.",
  },

  // ========== Pizza ==========
  {
    id: "19",
    name: "Veggie Supreme Pizza",
    nameKo: "",
    price: 18.99,
    category: "Pizza",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaOd-yzw835koYdEr8v0ecT5lvreJgMrz76g&s",
    description: "Loaded with fresh vegetables and melted cheese.",
    isVeg: true,
    isBest: true,
  },

  // ========== Mexican ==========
  {
    id: "20",
    name: "Tacos With Chicken Grilled",
    nameKo: "",
    price: 14.99,
    category: "Mexican",
    image:
      "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FEdit%2F2022-08-Grilled-Chicken-Tacos%2FGrilled_Chicken_Tacos-3",
    description: "Grilled chicken tacos with fresh salsa and guacamole.",
  },

  // ========== Desserts ==========
  {
    id: "13",
    name: "Chocolate Lava Cake",
    nameKo: "",
    price: 9.99,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    description: "Warm chocolate cake with a molten center.",
  },
  {
    id: "14",
    name: "Tiramisu",
    nameKo: "",
    price: 11.99,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    description: "Classic Italian dessert with coffee and mascarpone.",
  },

  // ========== Drinks ==========
  {
    id: "15",
    name: "Mango Smoothie",
    nameKo: "",
    price: 6.99,
    category: "Drink",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
    description: "Refreshing mango smoothie with ice.",
    isVeg: true,
  },
  {
    id: "16",
    name: "Jar Fruit Iced Tea",
    nameKo: "",
    price: 8.0,
    category: "Drink",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    description: "Refreshing iced tea with mixed fruits.",
  },
]
