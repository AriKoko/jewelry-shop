"use client"

import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) setTimeout(onClose, 300) // נקרא ל-onClose אחרי אנימצית הסגירה
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div 
        className={`rounded-lg shadow-lg py-3 px-5 flex items-center ${
          type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
          'bg-gray-50 text-gray-700 border border-gray-200'
        }`}
      >
        <span className="mr-2 text-lg">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
        </span>
        <p>{message}</p>
        <button 
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 300)
          }}
          className="mr-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
} 