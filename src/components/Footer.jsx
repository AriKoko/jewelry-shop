"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  
  const socialIcons = [
    { 
      name: 'instagram', 
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
      url: 'https://instagram.com/aviv5078'
    }
  ];
  
  // פרטי יצירת קשר מעודכנים מדף צור קשר
  const contactInfo = {
    phoneNumber: '0587455735',
    email: 'avivgoldboim@gmail.com',
    instagram: 'aviv5078',
    address: 'האלה 14, טל אל',
  };
  
  return (
    <footer className="bg-white pt-12 sm:pt-16 pb-6 relative overflow-hidden">
      {/* רקע דקורטיבי */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-0.5 primary-gradient"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent rounded-full transform -translate-x-1/4 translate-y-1/4 blur-xl"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-radial from-accent/5 to-transparent rounded-full transform translate-x-1/4 blur-xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-10 gap-8 md:gap-10">
          {/* לוגו ומידע */}
          <div className="md:col-span-3">
            <div className="flex items-center mb-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 relative mr-2 overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="font-title text-xl sm:text-2xl text-primary">תכשיטים לנערות</h2>
                <div className="w-16 h-0.5 bg-primary/30"></div>
              </div>
            </div>
            
            <p className="mb-6 text-gray-600 leading-relaxed text-sm sm:text-base">
              חנות התכשיטים המובילה לנערות עם מגוון רחב של מוצרים ואפשרויות לעיצוב אישי מותאם
            </p>
            
            <div className="flex gap-4 mb-8">
              {socialIcons.map((icon, index) => (
                <a 
                  key={icon.name}
                  href={icon.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  onMouseEnter={() => setHoveredIcon(index)}
                  onMouseLeave={() => setHoveredIcon(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${hoveredIcon === index ? 'scale-110' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* ניווט - מוסתר במובייל קטן */}
          <div className="hidden sm:block md:col-span-2">
            <h3 className="text-lg font-medium text-primary-800 mb-5 border-r-2 border-primary pr-3">ניווט מהיר</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'דף הבית' },
                { href: '/collection', label: 'קולקציה' },
                { href: '/custom-design', label: 'עיצוב אישי' },
                { href: '/favorites', label: 'המועדפים שלי' },
                { href: '/contact', label: 'צור קשר' }
              ].map((link) => (
                <li key={link.href} className="transform transition-transform hover:translate-x-2">
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-primary transition-colors flex items-center"
                  >
                    <svg className="h-3 w-3 ml-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* קטגוריות - מוסתר במובייל קטן */}
          <div className="hidden sm:block md:col-span-2">
            <h3 className="text-lg font-medium text-primary-800 mb-5 border-r-2 border-primary pr-3">קטגוריות</h3>
            <ul className="space-y-2">
              {[
                { href: '/collection?category=necklaces', label: 'שרשראות' },
                { href: '/collection?category=bracelets', label: 'צמידים' },
                { href: '/collection?category=face_masks', label: 'מסכות פנים' },
                { href: '/collection?category=phone_stickers', label: 'מדבקות לטלפון' },
                { href: '/custom-design', label: 'עיצוב אישי' }
              ].map((link) => (
                <li key={link.href} className="transform transition-transform hover:translate-x-2">
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-primary transition-colors flex items-center"
                  >
                    <svg className="h-3 w-3 ml-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* צור קשר */}
          <div className="sm:col-span-2 md:col-span-3">
            <h3 className="text-lg font-medium text-primary-800 mb-4 sm:mb-5 border-r-2 border-primary pr-3">צרי קשר</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start hover:translate-x-1 transition-transform">
                <div className="p-1.5 sm:p-2 ml-2 sm:ml-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">מיקום</p>
                  <span className="text-gray-600 text-xs sm:text-sm">{contactInfo.address}</span>
                </div>
              </li>
              <li className="flex items-start hover:translate-x-1 transition-transform">
                <div className="p-1.5 sm:p-2 ml-2 sm:ml-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">דוא"ל</p>
                  <span className="text-gray-600 text-xs sm:text-sm">{contactInfo.email}</span>
                </div>
              </li>
              <li className="flex items-start hover:translate-x-1 transition-transform">
                <div className="p-1.5 sm:p-2 ml-2 sm:ml-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">טלפון</p>
                  <span className="text-gray-600 text-xs sm:text-sm">{contactInfo.phoneNumber}</span>
                </div>
              </li>
              <li className="flex items-start hover:translate-x-1 transition-transform">
                <div className="p-1.5 sm:p-2 ml-2 sm:ml-3 bg-primary/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">אינסטגרם</p>
                  <a 
                    href={`https://instagram.com/${contactInfo.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline text-xs sm:text-sm block"
                  >
                    @{contactInfo.instagram}
                  </a>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 sm:mt-8">
              <Link 
                href="/contact" 
                className="inline-block bg-accent/10 hover:bg-accent/20 text-primary-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-colors duration-300 text-sm sm:text-base"
              >
                <span className="flex items-center">
                  <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  שליחת הודעה
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 sm:mt-10 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-xs sm:text-sm">&copy; {new Date().getFullYear()} תכשיטים לנערות. כל הזכויות שמורות.</p>
            <ul className="flex gap-3 sm:gap-4 mt-3 sm:mt-0 text-xs sm:text-sm">
              <li><Link href="/terms" className="text-gray-500 hover:text-primary transition-colors">תנאי שימוש</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-primary transition-colors">מדיניות פרטיות</Link></li>
              <li><Link href="/shipping" className="text-gray-500 hover:text-primary transition-colors">מדיניות משלוחים</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
} 