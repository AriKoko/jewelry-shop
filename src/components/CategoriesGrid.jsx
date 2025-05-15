"use client"

import Link from 'next/link'
import Image from 'next/image'
import { categories as staticCategories } from '../lib/products'
import { useState, useMemo } from 'react'

export default function CategoriesGrid({ categoryImages = {} }) {
  const [hovered, setHovered] = useState(null);
  
  // ממזג את התמונות הדינמיות עם רשימת הקטגוריות הסטטית
  const categories = useMemo(() => {
    return staticCategories.map(cat => {
      // מיפוי מזהי קטגוריות לשמות המפתחות באובייקט התמונות
      const keyMap = {
        necklaces: 'necklaces',
        bracelets: 'bracelets',
        face_masks: 'faceMasks',
        phone_stickers: 'phoneStickers'
      };
      const imageKey = keyMap[cat.id] || cat.id;
      return {
        ...cat,
        image: categoryImages[imageKey] || cat.image
      };
    });
  }, [categoryImages]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category, index) => (
        <Link 
          key={category.id}
          href={`/collection?category=${category.id}`}
          className="group block relative overflow-hidden rounded-xl shadow-subtle hover:shadow-elevated transition-all duration-500"
          onMouseEnter={() => setHovered(category.id)}
          onMouseLeave={() => setHovered(null)}
          style={{ 
            height: "270px",
            animationDelay: `${index * 150}ms`, 
          }}
        >
          {/* רקע דקורטיבי */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent z-10 transition-opacity duration-500"></div>
          
          {/* אפקט זוהר */}
          <div className={`absolute inset-0 bg-gradient-radial from-accent/30 to-transparent opacity-0 transition-opacity duration-500 z-10 ${hovered === category.id ? 'opacity-30' : ''}`}></div>
          
          {/* עיטור דקורטיבי */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 border-4 border-accent/20 rounded-full z-10 transform rotate-12 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-45"></div>
          <div className="absolute -top-6 -right-6 w-20 h-20 border-4 border-white/20 rounded-full z-10 transform rotate-45 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12"></div>
          
          {/* תמונת הקטגוריה */}
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transform transition-all duration-700 filter group-hover:scale-110 group-hover:brightness-105"
              style={{ 
                transformOrigin: hovered === category.id ? 'center center' : '50% 50%' 
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
              <p className="text-white">{category.name}</p>
            </div>
          )}
          
          {/* גבול זוהר */}
          <div className={`absolute inset-0 border-2 border-accent/0 transition-all duration-500 rounded-xl z-20 ${hovered === category.id ? 'border-accent/50' : ''}`}></div>
          
          {/* שם הקטגוריה */}
          <div className="absolute bottom-0 right-0 left-0 p-5 z-30 transform transition-transform duration-500 group-hover:translate-y-0">
            <h3 className="text-2xl text-white font-fancy mb-2 transform transition-all duration-500 group-hover:scale-105">{category.name}</h3>
            <div className="w-12 h-0.5 bg-accent mb-3 shimmer-effect transform transition-all duration-500 group-hover:w-20"></div>
            <div className="flex items-center transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-white text-sm mr-2">לצפייה בקולקציה</span>
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          
          {/* אפקט מעטפת על ריחוף */}
          <div className={`absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 transition-opacity duration-300 z-0 ${hovered === category.id ? 'opacity-100' : ''}`}></div>
        </Link>
      ))}
    </div>
  )
} 