"use client"
import { Cloud, Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

const TableQrPage = () => {
  const params = useParams();
  const tableNo = params.tableNo;

  const guestBase = process.env.NEXT_PUBLIC_GUEST_ORDER_BASE ?? 'https://order.easydining.com';
  const qrUrl = `${guestBase}/table=${encodeURIComponent(String(tableNo))}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[90%] bg-background flex items-center justify-center p-4 print:bg-white">
      <div className="text-center space-y-6 max-w-md">

        {/* Logo & Text */}
        <div className="space-y-2 print:hidden">
          <div className="mx-auto flex items-center justify-center mb-2">
            <Cloud className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-xl font-bold">EasyDining</h1>
          <p className="text-muted-foreground">Scan to order</p>
        </div>

        {/* QR Box */}
        <div className="bg-card p-8 rounded-2xl shadow-lg border border-border print:shadow-none print:border-0">
          <QRCodeSVG value={qrUrl} size={280} level="H" className="mx-auto" />
        </div>

        {/* Table text */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground print:hidden">
            Scan QR code to view menu and place your order
          </p>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="print:hidden bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
        >
          <Printer className="w-4 h-4" /> Print QR
        </button>

      </div>
    </div>
  );
};

export default TableQrPage;
