import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function QRCodePayment({ countdown, totalPayment, isProcessing, onConfirmPay, loading }: any) {
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
                    <h3 className="text-xl font-bold">Easy Dining</h3>
                    <div className="w-64 h-64 bg-white p-2 rounded-lg ">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                            alt="QR"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </>
            )}

            <div className="w-full max-w-md p-4 rounded-lg bg-muted/50 mb-6">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>US${totalPayment.toFixed(2)}</span>
                </div>
            </div>

            {!isProcessing && (
                <Button onClick={onConfirmPay} size="lg" className="w-full max-w-md" disabled={loading}>
                    {
                        loading ?
                            <>
                                <Spinner />
                                <span>Processing...</span>
                            </>
                            :
                            "Confirm Pay"
                    }
                </Button>
            )}
        </div>
    )
}