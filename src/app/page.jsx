"use client";

import Link from 'next/link'
import CategoriesGrid from '../components/CategoriesGrid'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// יצירת קומפוננטה נפרדת עבור דף הבית שיכולה להשתמש ב-client-side אפקטים
export default function Home() {
  return (
    <HomeContent />
  )
}

// קומפוננטת תוכן דף הבית עם האפשרות להשתמש בהוקים
function HomeContent() {
  const [homepageImages, setHomepageImages] = useState({
    collections: '/images/placeholders/jewelry-placeholder.jpg',
    customDesign: '/images/placeholders/jewelry-placeholder.jpg',
    categories: {
      necklaces: '/images/placeholders/jewelry-placeholder.jpg',
      bracelets: '/images/placeholders/jewelry-placeholder.jpg',
      faceMasks: '/images/placeholders/jewelry-placeholder.jpg',
      phoneStickers: '/images/placeholders/jewelry-placeholder.jpg'
    }
  });

  useEffect(() => {
    // טעינת התמונות מה-API
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/homepage/images');
        
        if (response.ok) {
          const data = await response.json();
          setHomepageImages(data);
        } else {
          console.error('שגיאה בטעינת תמונות דף הבית');
        }
      } catch (error) {
        console.error('שגיאה בטעינת תמונות דף הבית:', error);
      }
    };
    
    fetchImages();
  }, []);

  return (
    <div className="container-custom py-8">
      {/* רקע מינימליסטי */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/bg-pattern-light.svg')] bg-repeat opacity-5"></div>
        <div className="absolute -top-20 right-0 w-[25rem] h-[25rem] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 left-0 w-[25rem] h-[25rem] bg-gradient-to-t from-secondary/5 to-transparent rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* כותרת ראשית מינימליסטית */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title mb-6 text-primary">
            תכשיטים בעיצוב אישי
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            עיצובים ייחודיים המשקפים את הסגנון האישי שלך
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/collection" className="btn-minimal-primary group">
              <span>הקולקציה שלנו</span>
            </Link>
            <Link href="/custom-design" className="btn-minimal-secondary group">
              <span>עיצוב אישי</span>
            </Link>
          </div>
        </div>
        
        {/* קטגוריות בעיצוב מודרני ומינימליסטי */}
        <section className="mb-20 reveal">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-title mb-2 text-primary inline-block relative">
              <span>הקולקציה שלנו</span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary/30"></span>
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <CategoriesGrid categoryImages={homepageImages.categories} />
          </div>
        </section>
        
        {/* אזור העיצוב האישי */}
        <section className="mb-20 reveal">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8 shadow-sm">            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">עיצוב אישי</div>
                <h2 className="text-2xl md:text-3xl font-title mb-4 text-primary">
                  צרי תכשיט המותאם רק לך
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  בחרי חומרים, תליונים ועיצובים שאת אוהבת וצרי תכשיט ייחודי המותאם בדיוק לסגנון שלך
                </p>
                <div className="p-4 rounded-md bg-white border border-gray-100 mb-6 shadow-sm">
                  <p className="font-medium text-primary flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>כל עיצוב כולל 4 צ'ארמים חינם</span>
                  </p>
                </div>
                <Link href="/custom-design" className="btn-minimal-primary">
                  <span>התחילי לעצב עכשיו</span>
                </Link>
              </div>
              
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <Image 
                    src={homepageImages.customDesign} 
                    alt="תכשיטים מעוצבים" 
                    width={500} 
                    height={300} 
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* פתקית מידע */}
                <div className="absolute -bottom-4 right-8 bg-white p-3 rounded-md shadow-md border border-gray-100 max-w-[200px]">
                  <p className="text-primary-dark text-sm">ניתן להוסיף עד 10 צ'ארמים נוספים</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* מידע שימושי */}
        <section className="mb-16 reveal">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-title mb-2 text-primary inline-block relative">
              <span>מידע שימושי</span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary/30"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* תשלום */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">אפשרויות תשלום</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ביט למספר 0587455735</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>פייבוקס למספר 0587455735</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>מזומן בעת מסירה</span>
                </li>
              </ul>
            </div>
            
            {/* מסירה */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">מדיניות מסירה</h3>
              <p className="mb-4 text-gray-600">
                כל המוצרים מגיעים לאיסוף עצמי בלבד. לאחר הזמנה נשלח לך הודעה עם פרטי האיסוף.
              </p>
              <p className="font-medium text-primary text-center p-2 bg-primary/5 rounded-md">
                אין אפשרות למשלוח המוצרים בדואר
              </p>
            </div>
            
            {/* צ'ארמים */}
            <div className="relative bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-primary-dark text-xs font-medium px-3 py-1">
                מבצע מיוחד
              </div>
              
              <div className="w-10 h-10 rounded-md bg-accent/20 flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-4 4v12h10.2M16 8h2.914c1.42 0 2.914 1.5 2.914 3L20 16.657a3.4 3.4 0 01-1.293 2.575L17.5 20" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">מבצע צ'ארמים</h3>
              <p className="mb-3 text-gray-600">
                כל עיצוב אישי מגיע עם אפשרות לבחור <span className="font-medium text-primary">4 צ'ארמים חינם</span> מתוך מבחר הצ'ארמים שלנו!
              </p>
              <p className="mb-4 text-gray-600">
                צ'ארמים נוספים בתוספת תשלום של 5 ₪ לצ'ארם.
              </p>
              <Link href="/custom-design" className="btn-minimal-secondary w-full flex justify-center items-center gap-2">
                <span>לעיצוב אישי</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* סוף עמוד עם CTA */}
        <section className="text-center mb-16 reveal">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-title mb-4 text-primary">
                מוכנה להתחיל?
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                צרי קשר עוד היום ונעזור לך למצוא או לעצב את התכשיט המושלם עבורך
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/collection" className="btn-minimal-primary">
                  <span>לקולקציה המלאה</span>
                </Link>
                <Link href="/contact" className="btn-minimal-secondary">
                  <span>צרי קשר</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 