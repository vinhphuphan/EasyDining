"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Cloud, Mail } from "lucide-react"

export default function ForgotPinSentPage() {
  const params = useSearchParams()
  const router = useRouter()
  const email = params.get("email")

  return (
    <div className="min-h-screen flex">
      {/* Left - message */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Cloud className="h-12 w-12 text-primary" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl border-2 border-input flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a PIN to {email || "your email"}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Didn’t receive the email? <button className="text-primary hover:underline">Resend</button>
          </div>

          <button onClick={() => router.push("/login")} className="text-sm text-primary hover:underline">
            Back to log in
          </button>
        </div>
      </div>

      {/* Right - preview */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-8">
        <div className="w-full max-w-2xl aspect-[4/3] bg-card rounded-2xl shadow-lg border overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Home-1-BpfilzhQmWj3MX6UQ5TE0hcDFaykEg.png"
            alt="Dashboard Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}


