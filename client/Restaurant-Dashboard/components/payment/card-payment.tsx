import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function CardPayment({ countdown, totalPayment, isProcessing, onConfirmPay, loading }: any) {
    return (
        <div className="flex flex-col items-center justify-center flex-1">
            <p className="text-sm text-muted-foreground mb-6">
                Complete payment in <span className="text-destructive font-semibold">{countdown}</span>
            </p>

            {isProcessing ? (
                <>
                    <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mb-4" />
                    <p className="text-lg text-emerald-600 mb-8">Checking Payment...</p>
                </>
            ) : (
                <>
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/pos-terminal-payment-illustration-svg-download-png-12462554.png"
                        alt="EDC"
                        className="w-48 h-48 object-contain mb-6"
                    />
                    <h3 className="text-xl font-bold mb-2">Tap or Swipe card at EDC Machine</h3>
                    <p className="text-sm text-muted-foreground mb-8 text-center">
                        Follow the instructions on the terminal.
                    </p>
                </>
            )}

            <div className="w-full max-w-md p-4 rounded-lg bg-muted/50 mb-6">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totalPayment.toFixed(2)}</span>
                </div>
            </div>

            {!isProcessing && (
                <Button onClick={onConfirmPay} size="lg" className="w-full max-w-md" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner />
                            <span>Processing...</span>
                        </>
                    ) : (
                        "Confirm Pay"
                    )}
                </Button>
            )}
        </div>
    )
}