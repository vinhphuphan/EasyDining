"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cloud, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPinPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Simulate request sent, navigate to confirmation screen
    router.push(`/login/forgot/sent?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Cloud className="h-12 w-12 text-primary" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl border-2 border-input flex items-center justify-center">
              <Fingerprint className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Forgot PIN?</h1>
              <p className="text-sm text-muted-foreground">No worries, we’ll send your PIN</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base">Request PIN</Button>
          </form>

          <button onClick={() => router.push("/login")} className="text-sm text-primary hover:underline cursor-pointer">
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


