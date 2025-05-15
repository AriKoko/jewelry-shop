"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
      setIsLoading(true);
      // חיפוש מוצרים דרך ה-API, כולל פרמטר q
      fetch(`/api/products?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          // סינון מוצרים שאין להם מזהה אמיתי או תמונה אמיתית
          const filtered = (data.products || []).filter(
            p => (p._id || p.id) && p.image && !p.image.includes('placeholder')
          );
          setResults(filtered);
          setIsLoading(false);
        })
        .catch(() => {
          setResults([]);
          setIsLoading(false);
        });
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
              <ProductCard key={product._id || product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg sm:text-xl font-medium mb-1">לא נמצאו מוצרים מתאימים</h3>
            <p className="text-gray-500 text-sm sm:text-base">נסי לשנות את החיפוש או לחפש מונח אחר</p>
          </div>
        )}
      </div>
    </div>
  );
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