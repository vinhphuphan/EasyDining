"use client"
import { useState, useEffect, useRef } from "react"
import { ClipboardList, ChevronDown, ChevronUp } from "lucide-react"
import type { MenuItem } from "@/models/menuItem"
import { Header, HeaderBanner } from "@/components/header/Header"
import { useCategories, useMenu } from "@/hooks/useMenu"
import { CategoryNav } from "@/components/header/CategoryNav"
import { MenuItemCard } from "@/components/menu/MenuItemCard"
import { Cart } from "@/components/cart/Cart"
import OrdersModal from "@/components/OrdersModal"
import { ItemDetailModal } from "@/components/menu/ItemDetailModal"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const Index = () => {
  // State management
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const [ordersModalOpen, setOrdersModalOpen] = useState(false)

  // API calls
  const { menuItems, isLoading: menuLoading, error: menuError } = useMenu();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})


  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const isScrollingToCategory = useRef(false)

  useEffect(() => {
    if (categories.length > 0 && Object.keys(openCategories).length === 0) {
      const init: Record<string, boolean> = {}
      categories.forEach((cat: string) => {
        init[cat] = true
      })
      setOpenCategories(init)
      setActiveCategory(categories[0])
    }
  }, [categories, openCategories])

  /**
   * Scroll spy effect - updates active category based on scroll position
   */
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingToCategory.current) return
      const scrollPosition = window.scrollY + 300 // Offset for header + nav
      for (const category of categories) {
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
  }, [categories])

  // Handle category click - scroll to category section
  const handleCategoryChange = (category: string) => {
    const element = categoryRefs.current[category]
    if (element) {
      isScrollingToCategory.current = true
      setActiveCategory(category)
      // Scroll to category with offset for fixed header
      const yOffset = -220 // Header + nav height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setTimeout(() => {
        isScrollingToCategory.current = false
      }, 1000)
    }
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  const itemsByCategory = categories
    .map((category: string) => ({
      category,
      items: menuItems.filter((item: MenuItem) => item.category === category),
    }))
    .filter((group) => group.items.length > 0)


  // Loading state
  if (menuLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCartModalOpen(true)} />
        <HeaderBanner />
        <div className="flex justify-center items-center h-64">
          <Button disabled size="lg">
            <Spinner />
            Loading...
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (menuError || categoriesError) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCartModalOpen(true)} />
        <HeaderBanner />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-black">
            Error loading menu. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with cart button */}
      <Header onCartClick={() => setCartModalOpen(true)} />
      <HeaderBanner />
      {/* Category navigation */}
      <CategoryNav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} categories={categories} />
      {/* Main content area - continuous scroll */}
      <main className="w-full px-4 py-6 pb-24">
        {itemsByCategory.map(({ category, items }) => (
          <section
            key={category}
            ref={el => {
              categoryRefs.current[category] = el;
            }}
            className="mb-2"
          >
            {/* Category title with chevron for collapse */}
            <button
              className="flex items-center w-full justify-between text-2xl font-bold mb-6 border-b-[2px] border-black pb-2 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
              type="button"
              onClick={() => toggleCategory(category)}
              aria-expanded={openCategories[category]}
              aria-controls={`category-items-${category}`}
            >
              <span>{category}</span>
              {openCategories[category] ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
            {/* Category items, collapsible */}
            <div
              id={`category-items-${category}`}
              style={openCategories[category] ? { maxHeight: '1500px', transition: 'max-height 0.3s' } : { maxHeight: 0, overflow: 'hidden', transition: 'max-height 0.3s' }}
              aria-hidden={!openCategories[category]}
              className={openCategories[category] ? "space-y-4" : "space-y-4 pointer-events-none select-none"}
            >
              {openCategories[category] && items.map((item) => (
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
      <ItemDetailModal
        item={selectedItem}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        openCartDialog={() => setCartModalOpen(true)}
      />
      {/* Cart modal */}
      <Cart open={cartModalOpen} onClose={() => setCartModalOpen(false)} />
      <OrdersModal isOpen={ordersModalOpen} onClose={() => setOrdersModalOpen(false)} />
    </div>
  )
}

export default Index