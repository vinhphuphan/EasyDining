"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUploader } from "@/components/image-uploader";
import { Badge } from "@/components/ui/badge";
import { Flame, Leaf, Star } from "lucide-react";
import { useCreateMenuItemMutation } from "@/store/api/menuApi";
import { Spinner } from "../ui/spinner";

export function AddDishModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [dishName, setDishName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isBest, setIsBest] = useState(false);
  const [isVeg, setIsVeg] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);

  const [createMenuItem, { isLoading }] = useCreateMenuItemMutation();

  const handleSave = async () => {
    if (!dishName || !category || !price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newDish = {
      name: dishName,
      price: Number(price),
      description,
      imageUrl,
      category,
      isAvailable: true,
      isBest,
      isVeg,
      isSpicy,
    };

    try {
      await createMenuItem(newDish).unwrap();
      toast.success("Dish added successfully!", {
        description: `"${dishName}" has been added to the menu.`,
      });
      setDishName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setIsBest(false);
      setIsVeg(false);
      setIsSpicy(false);
      onClose();
    } catch (err: any) {
      toast.error("Failed to add dish", {
        description: err?.data?.message || "Something went wrong.",
      });
      console.log(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="w-full max-w-xl! p-8 max-h-[95vh] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center">Add New Dish</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dish Name */}
          <div className="space-y-2">
            <Label htmlFor="dishName">Dish Name</Label>
            <Input
              id="dishName"
              placeholder="Enter dish name"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Dish Category</Label>
            <div className="flex gap-2 flex-wrap">
              {["Soup", "Noodle", "Rice", "Dessert", "Drink"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image + Badges (2 columns) */}
          <div className="grid grid-cols-2 gap-6 items-start mb-3">
            {/* Left: Image Upload */}
            <div className="space-y-4">
              <Label>Dish Image</Label>
              <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} />
            </div>

            {/* Right: Special Badges */}
            <div className="space-y-2">
              <Label>Special Tags</Label>
              <div className="flex flex-col gap-5">
                <Badge
                  onClick={() => setIsBest(!isBest)}
                  className={`flex items-center gap-2 text-xs cursor-pointer px-2 py-1 rounded-lg transition 
                    ${isBest ? "bg-yellow-100 text-yellow-800" : "text-black/60 bg-muted hover:bg-muted/60"}`}
                >
                  <Star className="h-4 w-4" />
                  Best Seller
                </Badge>

                <Badge
                  onClick={() => setIsVeg(!isVeg)}
                  className={`flex items-center gap-2 text-xs cursor-pointer px-2 py-1 rounded-lg transition 
                    ${isVeg ? "bg-green-100 text-green-800" : "text-black/60 bg-muted hover:bg-muted/60"}`}
                >
                  <Leaf className="h-4 w-4" />
                  Vegetarian
                </Badge>

                <Badge
                  onClick={() => setIsSpicy(!isSpicy)}
                  className={`flex items-center gap-2 text-xs cursor-pointer px-2 py-1 rounded-lg transition 
                    ${isSpicy ? "bg-red-100 text-red-800" : "text-black/60 bg-muted hover:bg-muted/60"}`}
                >
                  <Flame className="h-4 w-4" />
                  Spicy
                </Badge>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : "Save Dish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
