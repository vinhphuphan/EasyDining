"use client"
import { useState } from "react";
import { Header, HeaderBanner } from "@/components/header/Header";
import { CategoryNav } from "@/components/header/CategoryNav";
import { ItemDetailModal } from "@/components/menu/ItemDetailModal";
import { Cart } from "@/components/cart/Cart";
import OrdersModal from "@/components/cart/OrdersModal";
import { menuItems, menuCategories, type MenuItem } from "@/data/menuData";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useCategoryCollapse } from "@/hooks/useCategoryCollapse";
import { MenuCategorySection } from "@/components/menu/MenuCategorySection";
import { ClipboardList } from "lucide-react";

/**
 * Main page for the menu (customer ordering screen).
 * Handles category navigation, scroll synchronization,
 * and modal interactions for item details, cart, and orders.
 */

export default function Index() {
  // State for modals and selected item
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);

  // Scroll spy logic (tracks visible category)
  const { activeCategory, categoryRefs, scrollToCategory } = useScrollSpy(menuCategories);

  // Category collapse state
  const { openCategories, toggleCategory } = useCategoryCollapse(menuCategories);

  // Handle user clicking a menu item card
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Group menu items by category
  const itemsByCategory = menuCategories
    .map(category => ({
      category,
      items: menuItems.filter(item => item.category === category),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header and navigation */}
      <Header onCartClick={() => setCartModalOpen(true)} />
      <HeaderBanner />
      <CategoryNav activeCategory={activeCategory} onCategoryChange={scrollToCategory} />

      {/* Main menu content */}
      <main className="w-full px-4 py-6 pb-24">
        {itemsByCategory.map(({ category, items }) => (
          <MenuCategorySection
            key={category}
            category={category}
            items={items}
            open={openCategories[category]}
            onToggle={() => toggleCategory(category)}
            onItemClick={handleItemClick}
            categoryRef={el => { categoryRefs.current[category] = el; }}
          />
        ))}
      </main>

      {/* Floating button to view current orders */}
      <button
        onClick={() => setOrdersModalOpen(true)}
        className="fixed bottom-10 left-4 z-30 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="View orders"
      >
        <ClipboardList className="w-6 h-6" />
      </button>

      {/* Item detail modal */}
      <ItemDetailModal
        item={selectedItem}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        openCartDialog={() => setCartModalOpen(true)}
      />

      {/* Cart modal */}
      <Cart open={cartModalOpen} onClose={() => setCartModalOpen(false)} />

      {/* Orders modal */}
      <OrdersModal isOpen={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
    </div>
  );
}
