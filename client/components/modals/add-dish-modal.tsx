"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AddDishModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddDishModal({ isOpen, onClose }: AddDishModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [dishName, setDishName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [ingredients, setIngredients] = useState<Array<{ name: string; quantity: string; unit: string }>>([])

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
  }

  const handleSaveAndNext = () => {
    if (!dishName || !category || !price) {
      toast.error("Please fill in all required fields")
      return
    }
    setStep(2)
  }

  const handleSaveAndSubmit = () => {
    toast.success("Dish Added Successfully!", {
      description: "Your new dish has been added to the menu. Ingredients and stock management are now linked.",
    })
    onClose()
    // Reset form
    setStep(1)
    setDishName("")
    setCategory("")
    setDescription("")
    setPrice("")
    setIngredients([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add New Dish</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-8">
          {/* Steps Sidebar */}
          <div className="w-48 space-y-2">
            <button
              onClick={() => setStep(1)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                step === 1 ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-full text-sm font-medium ${
                  step === 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Dish Info</span>
            </button>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                step === 2 ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-full text-sm font-medium ${
                  step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Ingredients</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Dish Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="dishName">Dish Name</Label>
                  <Input
                    id="dishName"
                    placeholder="Enter Dish Name"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dish Category</Label>
                  <div className="flex gap-2">
                    {["Soup", "Noodle", "Rice", "Dessert", "Drink"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          category === cat
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Dish Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter Dish Name"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

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

                <Button onClick={handleSaveAndNext} className="w-full">
                  Save and Next
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Ingredients</h3>

                <div className="space-y-4">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Ingredients Name</Label>
                        <Select
                          value={ingredient.name}
                          onValueChange={(value) => {
                            const newIngredients = [...ingredients]
                            newIngredients[index].name = value
                            setIngredients(newIngredients)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Ingredients" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chicken">Chicken</SelectItem>
                            <SelectItem value="beef">Beef</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="noodles">Noodles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) => {
                            const newIngredients = [...ingredients]
                            newIngredients[index].quantity = e.target.value
                            setIngredients(newIngredients)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select
                          value={ingredient.unit}
                          onValueChange={(value) => {
                            const newIngredients = [...ingredients]
                            newIngredients[index].unit = value
                            setIngredients(newIngredients)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="l">l</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="pcs">pcs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" onClick={handleAddIngredient} className="w-full bg-transparent">
                    + Add Ingredients
                  </Button>
                </div>

                <Button onClick={handleSaveAndSubmit} className="w-full">
                  Save and Submit
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
