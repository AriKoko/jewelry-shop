"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchProducts } from '../../lib/products'
import ProductCard from '../../components/ProductCard'
import Link from 'next/link'

// רכיב תוכן החיפוש עם גישה ל-searchParams
function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (query) {
      // חיפוש מוצרים לפי השאילתה
      const foundProducts = searchProducts(query);
      setResults(foundProducts);
      setIsLoading(false);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);
  
  return (
    <div className="container-custom py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-title text-primary mb-4">תוצאות חיפוש: {query}</h1>
        <div className="w-20 h-0.5 bg-primary/30 mb-6"></div>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center shadow-pastel">
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-title text-primary mb-4">לא נמצאו תוצאות</h2>
            <p className="text-gray-600 mb-6">לא נמצאו מוצרים התואמים את החיפוש "{query}"</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/collection" className="btn-primary">
                לצפייה בכל המוצרים
              </Link>
              <button onClick={() => window.history.back()} className="btn-outline">
                חזרה לדף הקודם
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 

// רכיב פאלבק לזמן טעינה
function SearchFallback() {
  return (
    <div className="container-custom py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-title text-primary mb-4">תוצאות חיפוש</h1>
        <div className="w-20 h-0.5 bg-primary/30 mb-6"></div>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    </div>
  )
}

// רכיב העמוד הראשי עם עטיפת Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  )
} 