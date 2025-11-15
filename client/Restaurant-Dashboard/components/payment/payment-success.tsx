import { Banknote, Check, CreditCard, Printer, QrCode } from "lucide-react"
import { Button } from "../ui/button"

export default function PaymentSuccess({ totalPayment, paymentMethod, customerPays, change, onPrintBills, onPaymentDone }: any) {
    const label =
        paymentMethod === "cash" ? "Cash" : paymentMethod === "card" ? "Card" : "QR Code"
    const icon =
        paymentMethod === "cash" ? (
            <Banknote className="h-4 w-4" />
        ) : paymentMethod === "card" ? (
            <CreditCard className="h-4 w-4" />
        ) : (
            <QrCode className="h-4 w-4" />
        )

    return (
        <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-primary-foreground" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-sm text-muted-foreground mb-8">Please thank the customer.</p>

            <div className="w-full max-w-md">
                <h3 className="font-semibold mb-4">Payment Details</h3>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold">US${totalPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Method</span>
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            {icon}
                            <span>{label}</span>
                        </div>
                    </div>
                    {paymentMethod === "cash" && (
                        <>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Customer Pays</span>
                                <span className="font-semibold">US${customerPays.toFixed(2)}</span>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50 mb-6">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Change</span>
                                    <span className="text-primary">US${change.toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onPrintBills}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Bills
                    </Button>
                    <Button className="flex-1" onClick={onPaymentDone}>
                        <Check className="h-4 w-4 mr-2" />
                        Done
                    </Button>
                </div>
            </div>
        </div >
    )
}