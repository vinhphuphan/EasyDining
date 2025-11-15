export function DataError({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-red-500 font-medium mb-4">Failed to load tables.</p>
            <button
                onClick={onRetry}
                className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
            >
                Retry
            </button>
        </div>
    )
}
