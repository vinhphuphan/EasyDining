import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaymentMethodSelectorProps {
    paymentMethod: "card" | "google-pay" | "cash"
    onPaymentMethodChange: (method: "card" | "google-pay" | "cash") => void
    onPay: () => void
    isLoading?: boolean
}

export const PaymentMethodSelector = ({
    paymentMethod,
    onPaymentMethodChange,
    onPay,
    isLoading = false
}: PaymentMethodSelectorProps) => {
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")

    const validateCardForm = () => {
        if (paymentMethod === "card") {
            return cardNumber.length >= 16 && expiry.length >= 5 && cvv.length >= 3
        }
        return true
    }

    const handlePay = () => {
        if (validateCardForm()) {
            onPay()
        }
    }

    return (
        <div>
            <h3 className="text-base font-semibold mb-2">Select your payment preference</h3>
            <p className="text-sm text-gray-500 mb-4">Payment</p>

            <div className="space-y-3">
                {/* Card Payment */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <button
                        onClick={() => onPaymentMethodChange("card")}
                        className={`w-full px-4 py-3 flex items-center justify-between ${paymentMethod === "card" ? "bg-gray-50" : "bg-white"
                            } cursor-pointer`}
                    >
                        <span className="font-medium">Cards</span>
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                            {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                    </button>

                    {paymentMethod === "card" && (
                        <div className="px-4 pb-4 space-y-3 bg-white">
                            <div>
                                <Label htmlFor="card-number" className="text-sm mb-1 block">
                                    Card number
                                </Label>
                                <Input
                                    id="card-number"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength={19}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="expiry" className="text-sm mb-1 block">
                                        Expiry date
                                    </Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cvv" className="text-sm mb-1 block">
                                        CVC / CVV
                                    </Label>
                                    <Input
                                        id="cvv"
                                        placeholder="3 digits"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handlePay}
                                disabled={!validateCardForm() || isLoading}
                                className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white cursor-pointer"
                            >
                                {isLoading ? "Processing..." : "Pay"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Google Pay */}
                <button
                    onClick={() => onPaymentMethodChange("google-pay")}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between ${paymentMethod === "google-pay" ? "bg-gray-50" : "bg-white"
                        } cursor-pointer`}
                >
                    <span className="font-medium">Google Pay</span>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                        {paymentMethod === "google-pay" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                </button>

                {/* Cash Payment */}
                <button
                    onClick={() => onPaymentMethodChange("cash")}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between ${paymentMethod === "cash" ? "bg-gray-50" : "bg-white"
                        } cursor-pointer`}
                >
                    <span className="font-medium text-left">Pay by cash or card before leaving</span>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0">
                        {paymentMethod === "cash" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                </button>
            </div>
        </div>
    )
}