// Video sahifasida
"use client"
import { useEffect, useState } from 'react'

export default function VideoPage({ params }) {
  const [watchTime, setWatchTime] = useState(0)
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    // Har soniyada watchTime'ni oshirish
    const interval = setInterval(() => {
      setWatchTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // 30 soniyadan keyin tracking API'ga so'rov yuborish
    if (watchTime >= 30 && !tracked) {
      trackVideoWatch()
      setTracked(true)
    }
  }, [watchTime, tracked])

  const trackVideoWatch = async () => {
    try {
      const response = await fetch('/api/video/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: params.videoId,
          videoTitle: 'Video nomi',
          watchTime: watchTime,
          totalDuration: 300 // 5 daqiqa
        })
      })

      const data = await response.json()
      
      if (data.missionResult?.success) {
        console.log('🎉 Missiya bajarildi:', data.missionResult.message)
        // Bu yerda toast ko'rsatish mumkin
      }
    } catch (error) {
      console.error('Video tracking error:', error)
    }
  }

  return (
    // Video player va boshqa kontent
    <div>
      <h1>Video Dars</h1>
      {/* Video player */}
      <p>Ko'rilgan vaqt: {watchTime} soniya</p>
    </div>
  )
}