"use client"

// ============================================
// MAIN PAGE
// ============================================
// Primary ordering interface with continuous scrolling menu

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/Header"
import { CategoryNav } from "@/components/CategoryNav"
import { MenuItemCard } from "@/components/MenuItemCard"
import { ItemDetailModal } from "@/components/ItemDetailModal"
import { CartModal } from "@/components/CartModal"
import OrdersModal from "@/components/OrdersModal"
import { menuItems, menuCategories, type MenuItem } from "@/data/menuData"
import { ClipboardList } from "lucide-react"

const Index = () => {
  // State management
  const [activeCategory, setActiveCategory] = useState(menuCategories[0])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [ordersModalOpen, setOrdersModalOpen] = useState(false)

  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const isScrollingToCategory = useRef(false)

  /**
   * Scroll spy effect - updates active category based on scroll position
   */
  useEffect(() => {
    const handleScroll = () => {
      // Don't update active category if user clicked a category (programmatic scroll)
      if (isScrollingToCategory.current) return

      const scrollPosition = window.scrollY + 300 // Offset for header + nav

      // Find which category section is currently in view
      for (const category of menuCategories) {
        const element = categoryRefs.current[category]
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /**
   * Handle category click - scroll to category section
   */
  const handleCategoryChange = (category: string) => {
    const element = categoryRefs.current[category]
    if (element) {
      isScrollingToCategory.current = true
      setActiveCategory(category)

      // Scroll to category with offset for fixed header
      const yOffset = -220 // Header + nav height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: "smooth" })

      // Reset flag after scroll completes
      setTimeout(() => {
        isScrollingToCategory.current = false
      }, 1000)
    }
  }

  /**
   * Handle menu item click - open detail modal
   */
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const itemsByCategory = menuCategories
    .map((category) => ({
      category,
      items: menuItems.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header with cart button */}
      <Header onCartClick={() => setCartModalOpen(true)} />

      {/* Category navigation */}
      <CategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      {/* Main content area - continuous scroll */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {itemsByCategory.map(({ category, items }) => (
          <section key={category} ref={(el) => (categoryRefs.current[category] = el)} className="mb-12">
            {/* Category title */}
            <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">{category}</h2>

            {/* Menu items for this category */}
            <div className="space-y-4">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <button
        onClick={() => setOrdersModalOpen(true)}
        className="fixed bottom-10 cursor-pointer left-4 z-30 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="View orders"
      >
        <ClipboardList className="w-6 h-6" />
      </button>

      {/* Item detail modal */}
      <ItemDetailModal item={selectedItem} open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Cart modal */}
      <CartModal open={cartModalOpen} onClose={() => setCartModalOpen(false)} />

      <OrdersModal isOpen={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
    </div>
  )
}

export default Index
