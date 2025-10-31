"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

const REFRESH_INTERVAL_MS = 12 * 60 * 1000 // 12 minutes

export default function TokenRefresher() {
  const router = useRouter()
  const pathname = usePathname()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isRefreshingRef = useRef(false)

  const shouldRefresh = () => {
    if (typeof window === "undefined") return false
    // Tránh refresh ở trang login
    if (pathname?.startsWith("/login")) return false
    try {
      const hasUser = !!localStorage.getItem("user")
      return hasUser
    } catch {
      return false
    }
  }

  const doRefresh = async () => {
    if (isRefreshingRef.current) return
    if (!shouldRefresh()) return
    isRefreshingRef.current = true
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
      })
      if (res.status === 401) {
        try {
          localStorage.removeItem("user")
        } catch {}
        router.replace("/login")
      }
      // 200/OK -> cookie đã được gia hạn, không cần làm gì thêm
    } catch {
      // Bỏ qua lỗi mạng tạm thời
    } finally {
      isRefreshingRef.current = false
    }
  }

  useEffect(() => {
    // Refresh ngay khi mount/navigate nếu hợp lệ
    void doRefresh()

    // Thiết lập chu kỳ 12 phút
    timerRef.current = setInterval(() => {
      void doRefresh()
    }, REFRESH_INTERVAL_MS)

    // Làm mới khi focus hoặc tab trở lại visible
    const onFocus = () => void doRefresh()
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void doRefresh()
    }
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
    // Re-init khi đổi route (đặc biệt là giữa login và các trang khác)
  }, [pathname])

  return null
}

