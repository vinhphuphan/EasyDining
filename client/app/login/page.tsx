"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cloud, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PinPad } from "@/components/pin-pad"
import { PinInput } from "@/components/pin-input"
import { employees } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [pin, setPin] = useState("")
  const { toast } = useToast()


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
      router.push("/dashboard")
    } else {
      toast({ title: "Incorrect PIN", variant: "destructive" })
      setPin("")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 bg-background">
        <div className="w-full max-w-md space-y-5">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">EasyDining</span>
          </div>

          {/* Title */}
          <div className="space-y-2 flex flex-col items-center">
            <h1 className="text-xl font-semibold">Employee Login</h1>
            <p className="text-muted-foreground text-sm">Choose your account to start your shift.</p>
          </div>

          {/* Employee Selector */}
          <div className="space-y-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-input hover:border-primary transition-colors cursor-pointer"
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
                {isDropdownOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 z-50 border-2 border-input rounded-xl overflow-hidden max-h-64 overflow-y-auto bg-white shadow-lg transition ease-out">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleEmployeeSelect(employee)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors border-b last:border-b-0"
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
            )}

            {/* PIN Input */}
            <div className="space-y-4 pt-3">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Please input your PIN to validate yourself.</p>
                <PinInput length={6} value={pin} />
                <button className="text-sm text-primary hover:underline">Forgot PIN?</button>
              </div>

              <PinPad onNumberClick={handleNumberClick} onDelete={handleDelete} />
            </div>

            {/* Start Shift Button */}
            <Button
              onClick={handleStartShift}
              disabled={pin.length !== 6}
              className="w-full h-12 text-base"
              size="lg"
            >
              Start Shift
            </Button>
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
