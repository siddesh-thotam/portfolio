'use client'
import React, { useEffect, useState } from 'react'

export default function Clock(){
  const [time, setTime] = useState<string>(() => new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
  useEffect(()=>{
    const t = setInterval(()=> {
      setTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}))
    }, 30_000)
    return ()=> clearInterval(t)
  },[])
  return <div className="clock">{time}</div>
}
