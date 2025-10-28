import { useGetMenuItemsQuery, useGetCategoriesQuery, useGetMenuItemByIdQuery } from '@/api/menuApi'

// Hook to get all menu items
export const useMenu = () => {
    const {
        data: menuItems = [],
        isLoading,
        error,
        refetch
    } = useGetMenuItemsQuery()

    return {
        menuItems,
        isLoading,
        error,
        refetch,
    }
}

// Hook to get categories
export const useCategories = () => {
    const {
        data: categories = [],
        isLoading,
        error
    } = useGetCategoriesQuery()

    return {
        categories,
        isLoading,
        error,
    }
}

// Hook to get menu item theo ID
export const useMenuItem = (id: number) => {
    const {
        data: menuItem,
        isLoading,
        error
    } = useGetMenuItemByIdQuery(id)

    return {
        menuItem,
        isLoading,
        error,
    }
}