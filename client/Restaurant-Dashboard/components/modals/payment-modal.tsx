"use client"

import { useState, useEffect } from "react"
import { X, CreditCard, QrCode, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { TableDto } from "@/types/table"
import { useCheckoutTableMutation } from "@/store/api/tableApi"
import { toast } from "sonner"
import CashPayment from "../payment/cash-payment"
import CardPayment from "../payment/card-payment"
import QRCodePayment from "../payment/qr-code-payment"
import PaymentSuccess from "../payment/payment-success"

type PaymentMethod = "cash" | "card" | "qr-code"
type PaymentStep = "input" | "processing" | "success"

interface Member {
  code: string
  name: string
  phone: string
  points: number
}

interface PaymentModalProps {
  table: TableDto
  onClose: () => void
  onPaymentComplete: () => void
}

export function PaymentModal({ table, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("input")
  const [cashAmount, setCashAmount] = useState("")
  const [memberCode, setMemberCode] = useState("")
  const [member, setMember] = useState<Member | null>(null)
  const [usePoints, setUsePoints] = useState(false)
  const [countdown, setCountdown] = useState(25 * 60)
  const [checkoutTable, { isLoading: isCheckingOut }] = useCheckoutTableMutation()

  // Mock members
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

  const activeOrders = table.orders?.filter(
    (o) => o.orderStatus !== "Paid" && o.orderStatus !== "Cancelled"
  ) ?? []

  // Combine all items from all orders
  const allItems =
    activeOrders.flatMap((order) =>
      order.items.map((item) => ({
        ...item,
        orderId: order.id,
      }))
    ) ?? []

  // Calculate totals
  const subtotal = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const pointsDiscount = usePoints && member ? member.points / 100 : 0
  const totalPayment = subtotal + tax - pointsDiscount
  const customerPays = Number.parseFloat(cashAmount) || 0
  const change = customerPays - totalPayment

  // Countdown for card/QR
  useEffect(() => {
    if ((paymentMethod === "card" || paymentMethod === "qr-code") && paymentStep === "input") {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentMethod, paymentStep])

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`
  }

  const handleMemberSearch = () => {
    const found = mockMembers[memberCode]
    if (found) setMember(found)
  }

  const handleNumberPad = (v: string) => {
    if (v === "backspace") setCashAmount((prev) => prev.slice(0, -1))
    else setCashAmount((prev) => prev + v)
  }

  const handleQuickAmount = (amount: number) => setCashAmount(amount.toString())

  const handlePayNow = async () => {
    if (paymentMethod !== "cash" || customerPays < totalPayment) return

    try {
      await checkoutTable(table.id).unwrap()
      setTimeout(() => setPaymentStep("success"), 1000)
    } catch {
      toast.error("Checkout failed. Please try again.")
    }
  }

  const handleConfirmPay = async () => {
    if (paymentMethod !== "card" && paymentMethod !== "qr-code") return
    setPaymentStep("processing")

    try {
      await checkoutTable(table.id).unwrap()
      setTimeout(() => setPaymentStep("success"), 1000)
    } catch {
      toast.error("Checkout failed. Please try again.")
      setPaymentStep("input")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* LEFT PANEL - TABLE INFO */}
        <div className="w-2/5 border-r p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Payment</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-3">Table Information</div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                <AvatarFallback>{getInitials(table.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{table.name}</div>
                <div className="text-sm text-muted-foreground">
                  {table.tableCode} • {table.status}
                </div>
              </div>
            </div>

            {/* Member lookup */}
            <div className="flex gap-2">
              <Input
                placeholder="Input Member Code"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
              />
              <Button onClick={handleMemberSearch}>Search</Button>
            </div>

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
                    <div className="text-lg font-bold text-primary">
                      {member.points.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-muted-foreground">100 points = $1</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Use Points?</span>
                    <Switch checked={usePoints} onCheckedChange={setUsePoints} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <div>
            <h3 className="font-semibold mb-3">Orders Summary</h3>
            <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
              {allItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No active orders to pay.
                </div>
              ) : (
                <>
                  {allItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.name}{" "}
                          <span className="text-muted-foreground text-xs">×{item.quantity}</span>
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {usePoints && member && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Points Discount</span>
                  <span>-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>${totalPayment.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - PAYMENT */}
        <div className="flex-1 p-6 flex flex-col">
          {paymentStep === "success" ? (
            <PaymentSuccess
              totalPayment={totalPayment}
              paymentMethod={paymentMethod}
              customerPays={customerPays}
              change={change}
              onPrintBills={() => console.log("Print bills")}
              onPaymentDone={onClose}
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {(["cash", "card", "qr-code"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${paymentMethod === method
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                      }`}
                  >
                    {method === "cash" && <Banknote className="h-4 w-4" />}
                    {method === "card" && <CreditCard className="h-4 w-4" />}
                    {method === "qr-code" && <QrCode className="h-4 w-4" />}
                    <span className="capitalize font-medium">{method}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col">
                {paymentMethod === "cash" && (
                  <CashPayment
                    cashAmount={cashAmount}
                    totalPayment={totalPayment}
                    onNumberPad={handleNumberPad}
                    onQuickAmount={handleQuickAmount}
                    onPayNow={handlePayNow}
                    loading={isCheckingOut}
                  />
                )}

                {paymentMethod === "card" && (
                  <CardPayment
                    countdown={formatCountdown(countdown)}
                    totalPayment={totalPayment}
                    isProcessing={paymentStep === "processing"}
                    onConfirmPay={handleConfirmPay}
                    loading={isCheckingOut}
                  />
                )}

                {paymentMethod === "qr-code" && (
                  <QRCodePayment
                    countdown={formatCountdown(countdown)}
                    totalPayment={totalPayment}
                    isProcessing={paymentStep === "processing"}
                    onConfirmPay={handleConfirmPay}
                    loading={isCheckingOut}
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
