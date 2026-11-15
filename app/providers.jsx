// app/providers.jsx
"use client"

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import ActivityPing from '@/components/ActivityPing'
import InterfeysQollovchi from '@/components/InterfeysQollovchi'

export function Providers({ children }) {
  return (
    <SessionProvider>
      {/* Kunlik seriyani hisoblash uchun — SessionProvider ichida bo'lishi shart */}
      <ActivityPing />
      {/* Shrift, urg'u rangi, animatsiya va kontrastni <html> ga qo'yadi */}
      <InterfeysQollovchi />
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--v3-yuza-2, #0d2159)',
            color: 'var(--v3-matn, #e9eeff)',
            border: '1px solid var(--v3-chiziq-2, rgba(255, 255, 255, 0.14))',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </SessionProvider>
  )
}