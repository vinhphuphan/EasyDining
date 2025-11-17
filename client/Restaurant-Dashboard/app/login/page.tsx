"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PinPad } from "@/components/login-pin/pin-pad"
import { PinInput } from "@/components/login-pin/pin-input"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const [pinCode, setPinCode] = useState("");
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleNumberClick = (num: string) => {
    if (pinCode.length < 6) setPinCode(pinCode + num)
  }

  const handleDelete = () => {
    setPinCode(pinCode.slice(0, -1))
  }

  const handleStartShift = async () => {
    if (pinCode.length !== 6 || !username) {
      toast.error("Please enter your username and 6-digit PIN");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pinCode }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Error when login:", err);
      toast.error("Unexpected error occurred. Please try again.");
      setPinCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background">
        <div className="w-full max-w-md space-y-5">
          <div className="flex flex-col items-center justify-center gap-2">
            <Cloud className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-xl font-semibold text-center">Employee Login</h1>

          <div className="flex flex-col gap-1 items-center justify-center px-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-4/5 p-3 rounded-xl border-2 border-input"
            />
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Please input your PIN to validate yourself.
              </p>
              <PinInput length={6} value={pinCode} />
              <button
                onClick={() => router.push("/login/forgot")}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                Forgot PIN?
              </button>
            </div>

            <PinPad onNumberClick={handleNumberClick} onDelete={handleDelete} />
          </div>

          <Button
            onClick={handleStartShift}
            disabled={pinCode.length !== 6 || !username || isLoading}
            className="w-full h-12 text-base mt-4"
            size="lg"
          >
            {isLoading ? <Spinner /> : "Start Shift"}
          </Button>
        </div>
      </div>

      {/* Right side */}
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
