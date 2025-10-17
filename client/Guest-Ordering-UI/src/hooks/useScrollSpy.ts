import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that tracks which category section is currently visible
 * while the user scrolls through the menu page.
 *
 * It also provides a smooth scroll-to-section behavior when clicking a category.
 */
export const useScrollSpy = (categories: string[]) => {
    // Currently active (visible) category
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    // References to each category section element on the page
    const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    // Prevents scroll spy from updating while we're auto-scrolling
    const isScrollingToCategory = useRef(false);

    // Effect that updates the active category when the user scrolls
    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingToCategory.current) return;

            const scrollPosition = window.scrollY + 300; // Offset for header + nav
            for (const category of categories) {
                const element = categoryRefs.current[category];
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveCategory(category);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [categories]);

    /**
     * Smoothly scrolls the viewport to the selected category section.
     */
    const scrollToCategory = (category: string) => {
        const element = categoryRefs.current[category];
        if (element) {
            isScrollingToCategory.current = true;
            setActiveCategory(category);

            const yOffset = -220; // Account for header and nav height
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: "smooth" });

            // Allow scroll spy to resume after animation
            setTimeout(() => {
                isScrollingToCategory.current = false;
            }, 1000);
        }
    };

    return { activeCategory, setActiveCategory, categoryRefs, scrollToCategory };
};
