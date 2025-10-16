import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Store } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  total: number;
}

export const PaymentModal = ({
  open,
  onClose,
  onPaymentComplete,
  total,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = () => {
    onPaymentComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card animate-slide-in-bottom">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <p className="text-sm text-muted-foreground">Select your payment preference</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-5 h-5" />
                      Cards
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center">
                      AMEX
                    </div>
                    <div className="w-8 h-5 bg-black rounded" />
                    <div className="w-8 h-5 bg-red-600 rounded" />
                    <div className="w-8 h-5 bg-blue-800 rounded text-white text-[8px] flex items-center justify-center">
                      VISA
                    </div>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={e => setExpiry(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVC / CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="3 digits"
                          value={cvv}
                          onChange={e => setCvv(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button onClick={handlePay} className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90">
                      Pay
                    </Button>
                  </div>
                )}
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google-pay" id="google-pay" />
                  <Label htmlFor="google-pay" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="w-5 h-5" />
                    Google Pay
                  </Label>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                    <Store className="w-5 h-5" />
                    Pay by cash or card before leaving
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>

          {paymentMethod !== 'card' && (
            <Button onClick={handlePay} className="w-full bg-primary hover:bg-primary/90">
              Confirm Payment Method
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
