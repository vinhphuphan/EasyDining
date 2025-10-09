"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cloud, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PinPad } from "@/components/login-pin/pin-pad"
import { PinInput } from "@/components/login-pin/pin-input"
import { employees } from "@/lib/mock-data"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [pin, setPin] = useState("")



  const handleEmployeeSelect = (employee: (typeof employees)[0]) => {
    setSelectedEmployee(employee)
    setIsDropdownOpen(false)
    setPin("")
  }

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num)
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
  }

  const handleStartShift = () => {
    if (pin === selectedEmployee.pin) {
      // mark authenticated for middleware via cookie
      document.cookie = `ed_auth=1; path=/; max-age=${60 * 60 * 8}`
      toast.success("Logged in successfully")
      router.push("/dashboard")
    } else {
      toast.error("Incorrect PIN")
      setPin("")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background">
        <div className="w-full max-w-md space-y-5">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Cloud className="h-12 w-12 text-primary" />

          </div>

          {/* Title */}
          <div className="space-y-2 flex flex-col items-center">
            <h1 className="text-xl font-semibold">Employee Login</h1>
          </div>

          {/* Employee Selector */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative inline-block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 ${isDropdownOpen ? "rounded-b-none" : ""
                  } border-input hover:border-primary transition-all duration-200 ease-out cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedEmployee.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedEmployee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium">{selectedEmployee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEmployee.shiftStart} - {selectedEmployee.shiftEnd}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>
              {/* Dropdown */}
              <div
                className={`absolute left-0 z-50 border-2 border-t-0 rounded-t-none w-full border-input rounded-xl overflow-hidden max-h-64 overflow-y-auto bg-white shadow-lg origin-top transform transition-all duration-200 ease-out ${isDropdownOpen
                  ? "visible opacity-100 scale-100 translate-y-0"
                  : "invisible pointer-events-none opacity-0 scale-95 -translate-y-2"
                  }`}
              >
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleEmployeeSelect(employee)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors border-b last:border-b-0 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium text-primary">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.shiftStart} - {employee.shiftEnd}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* PIN Input */}
              <div className="space-y-4 pt-3">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Please input your PIN to validate yourself.</p>
                  <PinInput length={6} value={pin} />
                  <button
                    onClick={() => router.push("/login/forgot")}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    Forgot PIN?
                  </button>
                </div>

                <PinPad onNumberClick={handleNumberClick} onDelete={handleDelete} />
              </div>

              {/* Start Shift Button */}
              <Button
                onClick={handleStartShift}
                disabled={pin.length !== 6}
                className="w-full h-12 text-base mt-4 cursor-pointer"
                size="lg"
              >
                Start Shift
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Preview (hidden on mobile) */}
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
