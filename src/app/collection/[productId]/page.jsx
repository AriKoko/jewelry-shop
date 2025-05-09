"use client"

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { paymentOptions } from '../../../lib/products'
import { fetchProductById } from '../../../lib/api'
import AddToCartButton from '../../../components/AddToCartButton'
import ImageWithFallback from '../../../components/ImageWithFallback'

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // טעינת המוצר מה-API
    fetchProductById(params.productId)
      .then(data => {
        // וידוא שכל השדות קיימים במוצר
        console.log("מוצר נטען מהשרת:", data);
        
        // וידוא שכל השדות החיוניים קיימים
        const validatedProduct = {
          ...data,
          // ודא שה-ID מוגדר
          id: data._id || data.id,
          // ודא שמחיר מוגדר
          price: data.price || 0,
          // ודא שתמונה מוגדרת
          image: data.image || '/images/placeholders/product-placeholder.jpg',
        };
        
        // בדוק שנתיב התמונה מתחיל ב-/ אם היא מקומית
        if (validatedProduct.image && !validatedProduct.image.startsWith('/') && !validatedProduct.image.startsWith('http')) {
          validatedProduct.image = '/' + validatedProduct.image;
        }
        
        console.log("מוצר מתוקן:", validatedProduct);
        setProduct(validatedProduct);
        setLoading(false);
      })
      .catch(err => {
        console.error('שגיאה בטעינת המוצר:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [params.productId]);
  
  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return notFound();
  }
  
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <Link href="/collection" className="text-primary hover:underline flex items-center">
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          חזרה לקולקציה
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* תמונת המוצר */}
          <div className="relative overflow-hidden rounded-lg h-[600px]">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          </div>
          
          {/* פרטי המוצר */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              <div className="flex items-center my-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-primary">₪{product.discountPrice}</span>
                    <span className="text-lg text-gray-500 line-through mr-2">₪{product.price}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">₪{product.price}</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4">
              <p className="mb-4">{product.description}</p>
              <p className="text-sm">
                <span className="font-medium">חומר: </span>
                {product.material}
              </p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2">אפשרויות תשלום</h3>
                <ul className="space-y-1 text-sm">
                  {paymentOptions.map(option => (
                    <li key={option.id} className="flex items-center">
                      <svg className="h-4 w-4 text-primary ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {option.name}
                      {option.phoneNumber && ` (${option.phoneNumber})`}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-medium mb-1 text-green-800">מבצע מיוחד</h3>
                <p className="text-green-700 text-sm">
                  כל הזמנה מגיעה עם אפשרות לבחירת 4 צ'ארמים חינם! 
                  עברי ל<Link href="/custom-design" className="underline font-medium">עיצוב אישי</Link> כדי לבחור צ'ארמים.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-yellow-800">שימי לב</h3>
                <p className="text-yellow-700 text-sm">
                  מוצר זה זמין לאיסוף עצמי בלבד. לאחר ביצוע ההזמנה נשלח לך הודעה עם פרטי האיסוף.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <AddToCartButton 
                  product={product} 
                  className="flex-grow"
                  showQuantity={true}
                />
                <Link 
                  href="/custom-design" 
                  className="btn-secondary flex items-center justify-center"
                >
                  <span>עיצוב אישי</span>
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">רוצה לעצב תכשיט משלך?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            בחרי את החומר, הצ'ארמים והסגנון שמתאימים לך, וצרי תכשיט ייחודי בהתאמה אישית.
            <br />
            <span className="font-medium">כל עיצוב כולל 4 צ'ארמים חינם!</span>
          </p>
          <Link href="/custom-design" className="btn-primary px-8 py-3 inline-flex items-center">
            <span>ליצירת עיצוב אישי</span>
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* מוצרים דומים - יתווסף בעתיד */}
    </div>
  );
} 