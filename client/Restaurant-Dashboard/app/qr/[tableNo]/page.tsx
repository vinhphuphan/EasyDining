"use client"
import { Cloud } from 'lucide-react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

const TableQrPage = () => {
  const params = useParams();
  const tableNo = params.tableNo;
  // Get the full URL for the menu page
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `${origin}/place-order/table-${params.tableNo}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-2">
          <div className=" mx-auto flex items-center justify-center mb-2">
            <Cloud className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">EasyDining</h1>
          <p className="text-muted-foreground">Scan to order</p>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-lg border border-border">
          <QRCodeSVG
            value={qrUrl}
            size={280}
            level="H"
            className="mx-auto"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Table {params.tableNo}
          </p>
          <p className="text-xs text-muted-foreground">
            Scan QR code to view menu and place your order
          </p>
        </div>
      </div>
    </div>
  );
};

export default TableQrPage;
