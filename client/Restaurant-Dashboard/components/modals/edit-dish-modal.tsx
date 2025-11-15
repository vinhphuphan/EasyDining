"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ImageUploader } from "@/components/image-uploader"
import { Badge } from "@/components/ui/badge"
import { Flame, Leaf, Star } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from "@/store/api/menuApi"

export interface EditDishModalProps {
    isOpen: boolean,
    onClose: () => void,
    dishId: number | null,
    onUpdated?: () => void
}

export function EditDishModal({ isOpen, onClose, dishId, onUpdated }: EditDishModalProps) {
    const [dishName, setDishName] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [imageUrl, setImageUrl] = useState<string>("")
    const [isBest, setIsBest] = useState(false)
    const [isVeg, setIsVeg] = useState(false)
    const [isSpicy, setIsSpicy] = useState(false)

    // Gọi API getMenuItemById khi modal mở
    const { data: menuItem, isLoading: isFetching } = useGetMenuItemByIdQuery(dishId!, {
        skip: !isOpen || !dishId,
    })

    const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation()

    useEffect(() => {
        if (menuItem && isOpen) {
            console.log(menuItem);
            setDishName(menuItem.name ?? "");
            setCategory(menuItem.category ?? "");
            setDescription(menuItem.description ?? "");
            setPrice(menuItem.price?.toString() ?? "");
            setImageUrl(menuItem.imageUrl ?? "");
            setIsBest(Boolean(menuItem.isBest));
            setIsVeg(Boolean(menuItem.isVeg));
            setIsSpicy(Boolean(menuItem.isSpicy));
        }
    }, [menuItem, isOpen]);

    const handleUpdate = async () => {
        if (!dishId) return;
        if (!dishName || !category || !price) {
            toast.error("Please fill in all required fields");
            return;
        }
        const payload = {
            name: dishName.trim(),
            category,
            description: description.trim(),
            price: Number(price),
            imageUrl,
            isAvailable: true,
            isBest,
            isVeg,
            isSpicy,
        };
        try {
            await updateMenuItem({ id: dishId, updates: payload }).unwrap();
            toast.success("Dish updated successfully!", { description: `"${dishName}" has been updated.` });
            onUpdated?.();
            onClose();
        } catch (err: any) {
            toast.error("Failed to update dish", { description: err?.data?.message ?? "Something went wrong." });
            console.log("Failed to update dish : ", err);
        }
    };

    if (isUpdating) return;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
            <DialogContent
                className="w-full max-w-xl! p-8 max-h-[95vh] overflow-y-auto"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Edit Dish</DialogTitle>
                </DialogHeader>

                {isFetching ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner /> <span className="ml-2 text-muted-foreground">Loading dish data...</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Dish Name */}
                        <div className="space-y-2">
                            <Label htmlFor="dishName">Dish Name</Label>
                            <Input value={dishName} onChange={(e) => setDishName(e.target.value)} />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <div className="flex gap-2 flex-wrap">
                                {["Soup", "Noodle", "Rice", "Dessert", "Drink"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        {/* Image + Tags */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label>Image</Label>
                                <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} disabled={isUpdating} existingImage={imageUrl} />
                            </div>

                            <div className="space-y-4">
                                <Label>Special Tags</Label>
                                <div className="flex flex-col gap-4">
                                    <Badge onClick={() => setIsBest(!isBest)} className={isBest ? "bg-yellow-200" : "bg-muted"}>
                                        <Star className="h-4 w-4" /> Best Seller
                                    </Badge>
                                    <Badge onClick={() => setIsVeg(!isVeg)} className={isVeg ? "bg-green-200" : "bg-muted"}>
                                        <Leaf className="h-4 w-4" /> Vegetarian
                                    </Badge>
                                    <Badge onClick={() => setIsSpicy(!isSpicy)} className={isSpicy ? "bg-red-200" : "bg-muted"}>
                                        <Flame className="h-4 w-4" /> Spicy
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>

                        <Button onClick={handleUpdate} className="w-full" disabled={isUpdating}>
                            {isUpdating ? <Spinner /> : "Save Changes"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
