import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { MenuItem } from "@/data/menuData";

interface Props {
    category: string;
    items: MenuItem[];
    open: boolean;
    onToggle: () => void;
    onItemClick: (item: MenuItem) => void;
    categoryRef: (el: HTMLElement | null) => void;
}

/**
 * Component representing a collapsible menu category section.
 * Each section can be expanded or collapsed to show/hide its menu items.
 */
export const MenuCategorySection = ({
    category,
    items,
    open,
    onToggle,
    onItemClick,
    categoryRef,
}: Props) => {
    return (
        <section ref={categoryRef} className="mb-2">
            {/* Category title bar with chevron icon for toggling */}
            <button
                className="flex items-center w-full justify-between text-2xl font-bold mb-6 border-b-[2px] border-black pb-2 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                type="button"
                onClick={onToggle}
                aria-expanded={open}
            >
                <span>{category}</span>
                {open ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>

            {/* Collapsible content with menu items */}
            <div
                style={open
                    ? { maxHeight: '1500px', transition: 'max-height 0.3s' }
                    : { maxHeight: 0, overflow: 'hidden', transition: 'max-height 0.3s' }}
                aria-hidden={!open}
                className={open ? "space-y-4" : "space-y-4 pointer-events-none select-none"}
            >
                {open && items.map(item => (
                    <MenuItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
                ))}
            </div>
        </section>
    );
};
