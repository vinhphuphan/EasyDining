import { useState } from "react";

/**
 * Custom hook to manage category collapsing (expand/collapse) state.
 * Keeps track of which categories are currently open or closed.
 */
export const useCategoryCollapse = (categories: string[]) => {
    // Initialize all categories as open by default
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        categories.forEach(cat => { init[cat] = true });
        return init;
    });

    /**
     * Toggles the open/closed state of a specific category section.
     */
    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return { openCategories, toggleCategory };
};
