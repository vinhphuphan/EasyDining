"use client"

import { useState } from "react"
import { X, User, Bell, Lock, Monitor, Check, Pencil } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PinPad } from "@/components/login-pin/pin-pad"

interface EmployeeProfileModalProps {
  isOpen: boolean
  onClose: () => void
  employee?: {
    id: string
    name: string
    role: string
    avatar: string
    shift: string
    phone: string
    email: string
    address: string
    joiningDate: string
    employmentStatus: string
    manager: string
  }
}

export function EmployeeProfileModal({ isOpen, onClose, employee }: EmployeeProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"employee" | "notification" | "security" | "display">("employee")
  const [isEditMode, setIsEditMode] = useState(false)
  const [showChangePinModal, setShowChangePinModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [pin, setPin] = useState("")

  const [editedEmployee, setEditedEmployee] = useState(employee || {
    id: "01011425",
    name: "Richardo Wilson",
    role: "Waiter",
    avatar: "/professional-man.jpg",
    shift: "10:00 AM - 12:00 PM",
    phone: "(629) 555-0123",
    email: "ajpdesign.info@gmail.com",
    address: "390 Market Street, Suite 200",
    joiningDate: "1 Jan, 2025",
    employmentStatus: "Full-Time Employment",
    manager: "Alexander Rodriguez",
  })

  const [notifications, setNotifications] = useState({
    kitchenPopup: true,
    kitchenSound: true,
    inventoryPopup: true,
    inventorySound: true,
    systemPopup: true,
    systemSound: true,
  })

  const handlePinComplete = (completedPin: string) => {
    setPin(completedPin)
  }

  const handleChangePinSubmit = () => {
    if (pin.length === 6) {
      setShowChangePinModal(false)
      setShowSuccessModal(true)
      setPin("")
    }
  }

  const handleSuccessOk = () => {
    setShowSuccessModal(false)
  }

  const handleSaveProfile = () => {
    setIsEditMode(false)
  }

  const handleCancelEdit = () => {
    setEditedEmployee(employee || editedEmployee)
    setIsEditMode(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0" showCloseButton={false}>
          <div className="flex h-[85vh]">
            <div className="w-64 border-r bg-muted/30 p-6 space-y-2">
              <h2 className="text-lg font-semibold mb-4">Setting</h2>
              <button
                onClick={() => setActiveTab("employee")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "employee" ? "bg-background shadow-sm" : "hover:bg-background/50"
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Employee Info</span>
              </button>
              <button
                onClick={() => setActiveTab("notification")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "notification" ? "bg-background shadow-sm" : "hover:bg-background/50"
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="text-sm font-medium">Notification</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "security" ? "bg-background shadow-sm" : "hover:bg-background/50"
                }`}
              >
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">Security</span>
              </button>
              <button
                onClick={() => setActiveTab("display")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "display" ? "bg-background shadow-sm" : "hover:bg-background/50"
                }`}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-sm font-medium">Display</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    {activeTab === "employee"
                      ? "Employee Info"
                      : activeTab === "notification"
                        ? "Notification"
                        : activeTab === "security"
                          ? "Security"
                          : "Display"}
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {activeTab === "employee" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={editedEmployee.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{editedEmployee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-muted-foreground">Employee ID# {editedEmployee.id}</div>
                          <div className="text-lg font-semibold">{editedEmployee.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Your shift today</div>
                        <div className="text-lg font-semibold">{editedEmployee.shift}</div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Employee Information</h4>
                        {!isEditMode ? (
                          <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveProfile}>
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-4">Personal</h5>
                        {isEditMode ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">Full Name</Label>
                                <Input
                                  value={editedEmployee.name}
                                  onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Phone</Label>
                                <Input
                                  value={editedEmployee.phone}
                                  onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Email</Label>
                                <Input
                                  value={editedEmployee.email}
                                  onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Address</Label>
                              <Input
                                value={editedEmployee.address}
                                onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                                <div className="text-sm">{editedEmployee.name}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Phone</div>
                                <div className="text-sm">{editedEmployee.phone}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Email</div>
                                <div className="text-sm">{editedEmployee.email}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="text-sm text-muted-foreground mb-1">Address</div>
                              <div className="text-sm">{editedEmployee.address}</div>
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <h5 className="text-sm font-medium mb-4">Work</h5>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Joining Date</div>
                            <div className="text-sm">{editedEmployee.joiningDate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Access Role</div>
                            <div className="text-sm">{editedEmployee.role}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Employment Status</div>
                            <div className="text-sm">{editedEmployee.employmentStatus}</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm text-muted-foreground mb-1">Manager</div>
                          <div className="text-sm">{editedEmployee.manager}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notification" && (
                  <div className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Kitchen Update</h4>
                        <p className="text-sm text-muted-foreground mb-4">Notification from kitchen, to inform about order.</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Pop up information</span>
                            <Switch
                              checked={notifications.kitchenPopup}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, kitchenPopup: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Notification sound</span>
                            <Switch
                              checked={notifications.kitchenSound}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, kitchenSound: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Inventory</h4>
                        <p className="text-sm text-muted-foreground mb-4">Notification about inventory, to inform about stock ingredients.</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Pop up information</span>
                            <Switch
                              checked={notifications.inventoryPopup}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, inventoryPopup: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Notification sound</span>
                            <Switch
                              checked={notifications.inventorySound}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, inventorySound: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">System Update</h4>
                        <p className="text-sm text-muted-foreground mb-4">Notification about update system.</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Pop up information</span>
                            <Switch
                              checked={notifications.systemPopup}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, systemPopup: checked })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Notification sound</span>
                            <Switch
                              checked={notifications.systemSound}
                              onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, systemSound: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div>
                        <h4 className="font-semibold mb-1">PIN</h4>
                        <p className="text-sm text-muted-foreground">Change PIN for your account</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowChangePinModal(true)}>
                        Change PIN
                        <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "display" && (
                  <div className="space-y-6">
                    <div className="p-6 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Display settings will be available soon.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showChangePinModal} onOpenChange={setShowChangePinModal}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Change PIN</h2>
            <button onClick={() => setShowChangePinModal(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium mb-6">Please input your New PIN</p>
              <div className="flex justify-center gap-2 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      i < pin.length ? "border-primary bg-primary/10" : "border-muted"
                    }`}
                  >
                    {i < pin.length && <div className="h-3 w-3 rounded-full bg-primary" />}
                  </div>
                ))}
              </div>
            </div>

            <PinPad onComplete={handlePinComplete} maxLength={6} />

            <Button onClick={handleChangePinSubmit} className="w-full" disabled={pin.length !== 6}>
              Change PIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md" showCloseButton={false}>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Change PIN Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your PIN successful changed, please don't forget about yor New PIN
            </p>
            <Button onClick={handleSuccessOk} className="w-full">
              Oke
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
