"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import ImageWithFallback from './ImageWithFallback'

export default function Hero({ title, subtitle, imageSrc, buttonText, buttonLink }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white shadow-pastel">
      {/* אפקט גלים מונפשים */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 left-0 right-0 h-48 bg-primary/20 blob-animation"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-accent/20 blob-animation delay-200"></div>
      </div>
      
      {/* רקע דקורטיבי */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10"></div>
      <div className="absolute inset-0 bg-floral-pattern opacity-20 z-10"></div>
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/3 z-10 floating-left-right"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-accent/10 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/3 z-10 floating-pulse"></div>
      
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center min-h-[400px] md:min-h-[500px] px-5 sm:px-8 py-10 sm:py-12">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-title font-bold text-primary mb-3 sm:mb-4">
            {title}
          </h1>
          <div className="w-16 sm:w-20 h-0.5 bg-primary/30 mb-4 sm:mb-6"></div>
          <p className={`text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {subtitle}
          </p>
          <div className={`flex flex-wrap gap-3 sm:gap-4 transition-all duration-700 delay-500 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {buttonLink && buttonText ? (
              <Link href={buttonLink} className="btn-primary hover-lift">
                {buttonText}
              </Link>
            ) : (
              <Link href="/collection" className="btn-primary hover-lift">
                לקולקציה המלאה
              </Link>
            )}
            <Link href="/custom-design" className="btn-outline hover-lift transition-all duration-300">
              עיצוב אישי
              <svg className="h-4 w-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>
          </div>
          
          {/* חותמת מחיר מיוחד */}
          <div className={`mt-6 sm:mt-10 inline-block transition-all duration-700 delay-700 transform ${isLoaded ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-4 opacity-0 rotate-12'}`}>
            <div className="relative glass-card p-3 sm:p-4 rounded-2xl border border-primary/20 shadow-pastel floating-subtle">
              <div className="absolute -top-3 -right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center text-primary-dark font-bold text-xs sm:text-sm shadow-pastel">
                חדש
              </div>
              <div className="relative z-10">
                <p className="text-xs sm:text-sm font-medium text-primary-dark">מבצע חורף 🔥</p>
                <p className="text-base sm:text-lg font-bold primary-gradient clip-text">20% הנחה על כל הקולקציה</p>
                <p className="text-[10px] sm:text-xs mt-1 text-gray-500">בתוקף עד לסוף החודש</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* תצוגת תמונה - גם במובייל */}
        <div className={`relative transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-2'}`}>
          {imageSrc ? (
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-pastel hover-lift fancy-border-primary">
              <div className="absolute inset-0 -m-3 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl blur-xl z-0 floating-pulse"></div>
              
              <div className="image-zoom-container rounded-2xl sm:rounded-3xl relative z-10">
                <Image 
                  src={imageSrc} 
                  alt="תכשיטים מעוצבים" 
                  width={600} 
                  height={400} 
                  className="image-zoom rounded-2xl sm:rounded-3xl object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = '/images/placeholders/jewelry-placeholder.jpg';
                  }}
                />
              </div>
              <div className="absolute inset-0 border border-primary/10 rounded-2xl sm:rounded-3xl pointer-events-none z-20"></div>
              
              <div className="absolute top-3 right-3 w-16 sm:w-20 h-16 sm:h-20 border-2 border-primary/20 rounded-full transform -translate-y-1/2 translate-x-1/2 z-0 floating-left-right"></div>
              <div className="absolute bottom-3 left-3 w-12 sm:w-16 h-12 sm:h-16 border-2 border-accent/20 rounded-full transform translate-y-1/2 -translate-x-1/2 z-0 floating-rotate"></div>
              
              {/* סימן מים */}
              <div className="absolute bottom-4 right-4 text-primary/40 text-xs font-title rotate-12 z-30 floating-subtle">
                Jewelry Shop
              </div>
              
              {/* אפקט זוהר בפינות */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-radial from-white/60 to-transparent rounded-full blur-xl z-20"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-accent/30 to-transparent rounded-full blur-xl z-20"></div>
              
              {/* כפתור לצפייה מהירה */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                <button className="glass-effect px-4 sm:px-5 py-2 rounded-full hover:scale-110 transition-transform duration-300 text-primary-dark font-medium shadow-pastel text-sm sm:text-base">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 inline-block ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  צפייה מהירה
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full md:w-[600px] bg-gray-100 rounded-2xl sm:rounded-3xl flex items-center justify-center glass-card shadow-pastel">
              <div className="relative z-10">
                <p className="text-gray-400">תמונת הדגמה</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 primary-gradient opacity-30 z-20"></div>
    </div>
  )
} 