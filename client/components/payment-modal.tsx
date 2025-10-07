"use client"

import { useState, useEffect } from "react"
import { X, CreditCard, QrCode, Banknote, Printer, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { Order } from "@/lib/mock-data"

interface PaymentModalProps {
  order: Order
  onClose: () => void
  onPaymentComplete: () => void
}

type PaymentMethod = "cash" | "card" | "qr-code"
type PaymentStep = "input" | "processing" | "success"

interface Member {
  code: string
  name: string
  phone: string
  points: number
}

export function PaymentModal({ order, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("input")
  const [cashAmount, setCashAmount] = useState("")
  const [memberCode, setMemberCode] = useState("")
  const [member, setMember] = useState<Member | null>(null)
  const [usePoints, setUsePoints] = useState(false)
  const [countdown, setCountdown] = useState(25 * 60) // 25 minutes in seconds

  // Mock member data
  const mockMembers: Record<string, Member> = {
    "011852950": {
      code: "011852950",
      name: "Eve",
      phone: "08219948251",
      points: 12400,
    },
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.12
  const pointsDiscount = usePoints && member ? member.points / 100 : 0
  const totalPayment = subtotal + tax - pointsDiscount

  const customerPays = Number.parseFloat(cashAmount) || 0
  const change = customerPays - totalPayment

  // Countdown timer for card/QR payment
  useEffect(() => {
    if ((paymentMethod === "card" || paymentMethod === "qr-code") && paymentStep === "input") {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentMethod, paymentStep])

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`
  }

  const handleMemberSearch = () => {
    const foundMember = mockMembers[memberCode]
    if (foundMember) {
      setMember(foundMember)
    }
  }

  const handleNumberPad = (value: string) => {
    if (value === "backspace") {
      setCashAmount((prev) => prev.slice(0, -1))
    } else {
      setCashAmount((prev) => prev + value)
    }
  }

  const handleQuickAmount = (amount: number) => {
    setCashAmount(amount.toString())
  }

  const handlePayNow = () => {
    if (paymentMethod === "cash") {
      if (customerPays >= totalPayment) {
        setPaymentStep("success")
      }
    }
  }

  const handleConfirmPay = () => {
    if (paymentMethod === "card" || paymentMethod === "qr-code") {
      setPaymentStep("processing")
      // Simulate payment processing
      setTimeout(() => {
        setPaymentStep("success")
      }, 2000)
    }
  }

  const handlePaymentDone = () => {
    onPaymentComplete()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Order Details */}
        <div className="w-2/5 border-r p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Payment</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-3">Customer Information</div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                <AvatarFallback>{getInitials(order.customerName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{order.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  Order# {order.orderNumber} / {order.type}
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{order.createdAt.split(" ").slice(0, 3).join(" ")}</div>
                <div>{order.createdAt.split(" ").slice(3).join(" ")}</div>
              </div>
            </div>

            {/* Member Code Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Input Member Code"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleMemberSearch}>Search</Button>
            </div>

            {/* Member Details */}
            {member && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Member Code: {member.code}</div>
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Points</div>
                    <div className="text-lg font-bold text-primary">{member.points.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">100 points = US$ 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Use Points?</span>
                    <Switch checked={usePoints} onCheckedChange={setUsePoints} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div>
            <h3 className="font-semibold mb-3">Order Details</h3>
            <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground">US$ {item.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground mb-1">× {item.quantity}</div>
                    <div className="font-semibold">US$ {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub Total</span>
                <span>US${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax 12%</span>
                <span>US${tax.toFixed(2)}</span>
              </div>
              {usePoints && member && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Member Points</span>
                  <span>− US${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Payment</span>
                <span>US${totalPayment.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Payment Interface */}
        <div className="flex-1 p-6 flex flex-col">
          {paymentStep === "success" ? (
            <PaymentSuccess
              totalPayment={totalPayment}
              paymentMethod={paymentMethod}
              customerPays={customerPays}
              change={change}
              onPrintBills={() => console.log("Print bills")}
              onPaymentDone={handlePaymentDone}
            />
          ) : (
            <>
              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    paymentMethod === "cash"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <Banknote className="h-4 w-4" />
                  <span className="font-medium">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    paymentMethod === "card"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("qr-code")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    paymentMethod === "qr-code"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span className="font-medium">QR Code</span>
                </button>
              </div>

              {/* Payment Content */}
              <div className="flex-1 flex flex-col">
                {paymentMethod === "cash" && (
                  <CashPayment
                    cashAmount={cashAmount}
                    totalPayment={totalPayment}
                    onNumberPad={handleNumberPad}
                    onQuickAmount={handleQuickAmount}
                    onPayNow={handlePayNow}
                  />
                )}

                {paymentMethod === "card" && (
                  <CardPayment
                    countdown={formatCountdown(countdown)}
                    totalPayment={totalPayment}
                    isProcessing={paymentStep === "processing"}
                    onConfirmPay={handleConfirmPay}
                  />
                )}

                {paymentMethod === "qr-code" && (
                  <QRCodePayment
                    countdown={formatCountdown(countdown)}
                    totalPayment={totalPayment}
                    isProcessing={paymentStep === "processing"}
                    onConfirmPay={handleConfirmPay}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Cash Payment Component
function CashPayment({
  cashAmount,
  totalPayment,
  onNumberPad,
  onQuickAmount,
  onPayNow,
}: {
  cashAmount: string
  totalPayment: number
  onNumberPad: (value: string) => void
  onQuickAmount: (amount: number) => void
  onPayNow: () => void
}) {
  const displayAmount = cashAmount || "0"

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h3 className="text-lg font-semibold mb-2">Input Money</h3>
      <p className="text-sm text-muted-foreground mb-6">Input the cash amount received from the customer.</p>

      {/* Amount Display */}
      <div className="text-6xl font-bold mb-6">${displayAmount}</div>

      {/* Quick Amount Buttons */}
      <div className="flex gap-3 mb-6">
        {[20, 50, 100, 200].map((amount) => (
          <button
            key={amount}
            onClick={() => onQuickAmount(amount)}
            className="px-6 py-2 rounded-lg border hover:bg-accent transition-colors font-medium"
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onNumberPad(num.toString())}
            className="h-16 text-2xl font-semibold rounded-lg border hover:bg-accent transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onNumberPad("0")}
          className="h-16 text-2xl font-semibold rounded-lg border hover:bg-accent transition-colors col-span-2"
        >
          0
        </button>
        <button
          onClick={() => onNumberPad("backspace")}
          className="h-16 rounded-lg border hover:bg-accent transition-colors flex items-center justify-center"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Pay Now Button */}
      <Button
        onClick={onPayNow}
        size="lg"
        className="w-full max-w-md"
        disabled={Number.parseFloat(cashAmount || "0") < totalPayment}
      >
        Pay Now
      </Button>
    </div>
  )
}

// Card Payment Component
function CardPayment({
  countdown,
  totalPayment,
  isProcessing,
  onConfirmPay,
}: {
  countdown: string
  totalPayment: number
  isProcessing: boolean
  onConfirmPay: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-sm text-muted-foreground mb-6">
        Complete payment in <span className="text-destructive font-semibold">{countdown}</span>
      </div>

      {isProcessing ? (
        <>
          <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mb-4" />
          <p className="text-lg font-semibold text-emerald-600 mb-8">Checking Payment</p>
        </>
      ) : (
        <>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/payment-by-card-9sjmPEY2bOx537jFQ7rqFdtLCjw1Bj.png"
            alt="EDC Machine"
            className="w-48 h-48 object-contain mb-6"
          />
          <h3 className="text-xl font-bold mb-2">Tap or Swipe card at EDC Machine</h3>
          <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
            Next step you can follow the instruction at EDC Machine.
          </p>
        </>
      )}

      <div className="w-full max-w-md p-4 rounded-lg bg-muted/50 mb-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total Payment</span>
          <span>US${totalPayment.toFixed(2)}</span>
        </div>
      </div>

      {!isProcessing && (
        <Button onClick={onConfirmPay} size="lg" className="w-full max-w-md">
          Confirm Pay
        </Button>
      )}
    </div>
  )
}

// QR Code Payment Component
function QRCodePayment({
  countdown,
  totalPayment,
  isProcessing,
  onConfirmPay,
}: {
  countdown: string
  totalPayment: number
  isProcessing: boolean
  onConfirmPay: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-sm text-muted-foreground mb-6">
        Complete payment in <span className="text-destructive font-semibold">{countdown}</span>
      </div>

      {isProcessing ? (
        <>
          <h3 className="text-xl font-bold mb-8">Aurora Restaurant</h3>
          <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mb-4" />
          <p className="text-lg font-semibold text-emerald-600 mb-8">Checking Payment</p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-6">Aurora Restaurant</h3>
          <div className="w-64 h-64 bg-white p-4 rounded-lg mb-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/payment-by-QR-code-dMb5aPYSvHipdcpXDHjCpU0vJCwFTj.png"
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        </>
      )}

      <div className="w-full max-w-md p-4 rounded-lg bg-muted/50 mb-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total Payment</span>
          <span>US${totalPayment.toFixed(2)}</span>
        </div>
      </div>

      {!isProcessing && (
        <Button onClick={onConfirmPay} size="lg" className="w-full max-w-md">
          Confirm Pay
        </Button>
      )}
    </div>
  )
}

// Payment Success Component
function PaymentSuccess({
  totalPayment,
  paymentMethod,
  customerPays,
  change,
  onPrintBills,
  onPaymentDone,
}: {
  totalPayment: number
  paymentMethod: PaymentMethod
  customerPays: number
  change: number
  onPrintBills: () => void
  onPaymentDone: () => void
}) {
  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case "cash":
        return "Cash"
      case "card":
        return "Card"
      case "qr-code":
        return "QR Code"
    }
  }

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "qr-code":
        return <QrCode className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
        <Check className="h-10 w-10 text-primary-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-sm text-muted-foreground mb-8">Don't forget to say Thank You to customers</p>

      <div className="w-full max-w-md">
        <h3 className="font-semibold mb-4">Detail Payment</h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Total Payment</span>
            <span className="font-semibold">US${totalPayment.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Payment Method</span>
            <div className="flex items-center gap-2 text-primary font-semibold">
              {getPaymentMethodIcon()}
              <span>{getPaymentMethodLabel()}</span>
            </div>
          </div>
          {paymentMethod === "cash" && (
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Customer Pays</span>
              <span className="font-semibold">US${customerPays.toFixed(2)}</span>
            </div>
          )}
        </div>

        {paymentMethod === "cash" && (
          <div className="p-4 rounded-lg bg-muted/50 mb-6">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Change</span>
              <span className="text-primary">US${change.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrintBills}>
            <Printer className="h-4 w-4 mr-2" />
            Print Bills
          </Button>
          <Button className="flex-1" onClick={onPaymentDone}>
            <Check className="h-4 w-4 mr-2" />
            Payment Done
          </Button>
        </div>
      </div>
    </div>
  )
}
