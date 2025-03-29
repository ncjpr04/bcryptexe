"use client"

export function DebugEnv() {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg z-50">
      <pre>
        GOOGLE_CLIENT_ID: {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Missing'}
      </pre>
      <button 
        className="mt-2 px-2 py-1 bg-blue-500 rounded text-sm"
        onClick={() => {
          console.log('Environment variables:', {
            GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
          })
        }}
      >
        Log details
      </button>
    </div>
  )
} 