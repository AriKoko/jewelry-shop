"use client"

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { getFeaturedProducts } from '../lib/products'

export default function FeaturedProducts() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    setFeaturedProducts(getFeaturedProducts());
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* אלמנטים דקורטיביים */}
      <div className="absolute -top-10 -right-12 w-64 h-64 bg-gradient-radial from-accent/5 to-transparent rounded-full z-0"></div>
      <div className="absolute -bottom-10 -left-12 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent rounded-full z-0"></div>
      
      {featuredProducts && featuredProducts.length > 0 ? (
        featuredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="relative z-10"
            style={{ animationDelay: `${(index + 1) * 150}ms` }}
          >
            <ProductCard product={product} index={index} />
          </div>
        ))
      ) : (
        <div className="col-span-3 text-center py-10">
          <p className="text-gray-500">לא נמצאו מוצרים מובחרים</p>
        </div>
      )}
    </div>
  )
} 