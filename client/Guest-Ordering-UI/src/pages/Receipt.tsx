import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Printer, Home } from 'lucide-react';
import { useEffect } from 'react';

const Receipt = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    clearCart();
    navigate('/');
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card rounded-lg border border-border p-8 print:border-0" id="receipt">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">EasyDining</h1>
            <p className="text-sm text-muted-foreground">Restaurant</p>
            <p className="text-sm text-muted-foreground">Table 1</p>
            <p className="text-sm text-muted-foreground mt-2">
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="border-t border-b border-border py-4 mb-4">
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.options?.flavor && (
                      <p className="text-sm text-muted-foreground">• {item.options.flavor}</p>
                    )}
                    {item.options?.size && (
                      <p className="text-sm text-muted-foreground">• {item.options.size}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for dining with us!</p>
            <p className="mt-2">🎉 Please visit again 🎉</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6 print:hidden">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button
            onClick={handleNewOrder}
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
          >
            <Home className="w-4 h-4" />
            New Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
