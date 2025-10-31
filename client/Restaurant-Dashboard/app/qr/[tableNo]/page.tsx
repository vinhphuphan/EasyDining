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
"use client"

import { useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type Props = { params: { tableNo: string } }

export default function QRPage({ params }: Props) {
  const searchParams = useSearchParams()
  const auto = searchParams.get("auto")

  const tableNo = decodeURIComponent(params.tableNo ?? "").trim()

  // Target URL for guests to order
  const orderUrl = useMemo(() => {
    return `https://order.easydining.com/table=${encodeURIComponent(tableNo)}`
  }, [tableNo])

  const qrSrc = useMemo(() => {
    const size = "280x280"
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(orderUrl)}`
  }, [orderUrl])

  useEffect(() => {
    if (auto) {
      // Defer print slightly to ensure image is rendered
      const id = setTimeout(() => window.print(), 300)
      return () => clearTimeout(id)
    }
  }, [auto])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border bg-card text-card-foreground shadow p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">EasyDining</div>
            <div className="text-lg font-semibold">Bàn {tableNo}</div>
          </div>

          <img className="w-[280px] h-[280px]" src={qrSrc} alt={`QR cho bàn ${tableNo}`} />

          <div className="mt-3 text-sm text-muted-foreground text-center">
            Quét mã để đặt món tại bàn này
          </div>
          <a
            className="mt-2 text-sm text-primary break-all"
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {orderUrl}
          </a>

          <div className="mt-5 print:hidden">
            <Button size="sm" onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  )
}
