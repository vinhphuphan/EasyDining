import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function CashPayment({ cashAmount, onNumberPad, onQuickAmount, onPayNow, loading }: any) {
    return (
        <div className="flex flex-col items-center justify-center flex-1">
            <h3 className="text-lg font-semibold mb-2">Input Cash</h3>
            <div className="text-2xl font-bold mb-6">${cashAmount || "0"}</div>

            <div className="flex gap-3 mb-6">
                {[20, 50, 100, 200].map((a) => (
                    <button
                        key={a}
                        onClick={() => onQuickAmount(a)}
                        className="px-6 py-2 rounded-lg border hover:bg-accent font-medium"
                    >
                        ${a}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                        key={n}
                        onClick={() => onNumberPad(n.toString())}
                        className="h-12 text-2xl font-semibold rounded-lg border hover:bg-accent"
                    >
                        {n}
                    </button>
                ))}
                <button
                    onClick={() => onNumberPad("0")}
                    className="h-12 text-2xl font-semibold rounded-lg border hover:bg-accent col-span-2"
                >
                    0
                </button>
                <button
                    onClick={() => onNumberPad("backspace")}
                    className="h-12 rounded-lg border hover:bg-accent flex items-center justify-center"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <Button
                onClick={onPayNow}
                size="lg"
                className="w-full max-w-md h-12 flex items-center justify-center gap-2"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Spinner />
                        <span>Processing...</span>
                    </>
                ) : (
                    "Pay Now"
                )}
            </Button>

        </div>
    )
}