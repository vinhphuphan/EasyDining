"use client"

import { Cloud, Loader2 } from "lucide-react"

interface LoadingScreenProps {
  label?: string
}

export default function LoadingScreen({ label = "Loading" }: LoadingScreenProps) {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl border-2 border-input bg-background flex items-center justify-center shadow-sm">
            <Cloud className="h-8 w-8 text-primary" />
          </div>
          {/* glow */}
          <div className="absolute inset-0 -z-10 blur-2xl rounded-full bg-primary/20 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{label}…</span>
        </div>

        {/* progress bar */}
        <div className="w-64 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-1/3 bg-primary animate-[progress_1.2s_ease-in-out_infinite] rounded-full" />
        </div>

        {/* subtle skeletons to match app cards */}
        <div className="hidden md:grid grid-cols-3 gap-3 w-[640px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl border bg-card shadow-xs overflow-hidden">
              <div className="h-full w-full animate-pulse bg-gradient-to-r from-muted/60 via-muted/30 to-muted/60 bg-[length:200%_100%]" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress { 0% { transform: translateX(-120%); } 100% { transform: translateX(300%); } }
      `}</style>
    </div>
  )
}


