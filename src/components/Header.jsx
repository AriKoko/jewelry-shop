"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  
  // מעקב אחרי סקרול כדי לשנות את מראה הכותרת
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // סגירת התפריט הנייד בעת ניווט
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // בדיקת פריטים בעגלה
  useEffect(() => {
    // פונקציה לחישוב מספר הפריטים בעגלה
    const checkCartItems = () => {
      try {
        const cartItems = localStorage.getItem('cartItems');
        if (cartItems) {
          const items = JSON.parse(cartItems);
          // חישוב סך הכמויות ולא רק מספר הפריטים הייחודיים
          const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemsCount(totalCount);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setCartItemsCount(0);
      }
    };
    
    // בדיקה ראשונית
    checkCartItems();
    
    // האזנה לשינויים בלוקל סטורג' (בין חלונות)
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems' || e.key === null) {
        checkCartItems();
      }
    };
    
    // האזנה לאירוע עדכון עגלה מותאם (בתוך אותו חלון)
    const handleCartUpdate = (e) => {
      checkCartItems();
      // אנימציית ריענון לאייקון העגלה אם יש פריטים
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon && cartItemsCount > 0) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
          cartIcon.classList.remove('animate-bounce');
        }, 1000);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // מעקב בזמן אמת אחרי שינויים בעגלה
    const intervalId = setInterval(checkCartItems, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(intervalId);
    };
  }, [cartItemsCount]);
  
  // בדיקת פריטים במועדפים
  useEffect(() => {
    const checkFavorites = () => {
      try {
        const favorites = localStorage.getItem('favoriteItems');
        if (favorites) {
          const items = JSON.parse(favorites);
          setFavoritesCount(items.length);
        } else {
          setFavoritesCount(0);
        }
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavoritesCount(0);
      }
    };
    
    checkFavorites();
    
    // מאזין אירועים לשינויים במועדפים
    const handleFavoritesUpdate = () => {
      checkFavorites();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);
  
  const navLinks = [
    { href: '/', label: 'דף הבית' },
    { href: '/collection', label: 'קולקציה' },
    { href: '/custom-design', label: 'עיצוב אישי' },
    { href: '/favorites', label: 'המועדפים שלי' },
    { href: '/contact', label: 'צור קשר' },
  ];
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
        : 'bg-white/80 backdrop-blur-md py-3 sm:py-4'
    }`}>
      {/* קו דקורטיבי בחלק העליון */}
      <div className="absolute top-0 left-0 right-0 h-0.5 primary-gradient"></div>
      
      <div className="container-custom flex justify-between items-center">
        {/* לוגו */}
        <Link href="/" className="relative group flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 relative mr-1 sm:mr-2 overflow-hidden">
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-75 group-hover:scale-100 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-xl md:text-2xl font-title text-primary transition-colors duration-300 group-hover:text-primary-dark">
              Jewelry
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-title text-secondary mr-1 transition-colors duration-300 group-hover:text-secondary-dark">
              Shop
            </span>
          </div>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/50 transition-all duration-300 group-hover:w-full"></div>
        </Link>
        
        {/* תפריט למובייל */}
        <button 
          className="md:hidden glass-effect p-2 rounded-full transition-all duration-300 hover:shadow-glow text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              className="transition-all duration-300" 
            />
          </svg>
        </button>
        
        {/* תפריט לנייד שנפתח */}
        <div className={`md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="container-custom pt-20 pb-8">
            <nav className="flex flex-col items-center gap-5">
              {navLinks.map((link, index) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`text-lg py-2 px-4 rounded-lg transition-all duration-300 relative group ${
                    pathname === link.href 
                      ? 'text-primary font-medium' 
                      : 'text-gray-700 hover:text-primary'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative z-10">{link.label}</span>
                  {pathname === link.href ? (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary w-full"></div>
                  ) : (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300"></div>
                  )}
                </Link>
              ))}
              
              <div className="flex gap-6 mt-6">
                <Link 
                  href="/cart" 
                  className="relative p-2 text-gray-700 hover:text-primary transition-colors"
                  aria-label="עגלת קניות"
                >
                  <svg className="h-5 w-5 cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                      {cartItemsCount}
                    </div>
                  )}
                </Link>
                
                <Link 
                  href="/favorites" 
                  className="relative p-2 text-gray-700 hover:text-primary transition-colors"
                  aria-label="מועדפים"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {favoritesCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {favoritesCount}
                    </div>
                  )}
                </Link>
                
                <button 
                  className="p-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setSearchOpen(true)}
                  aria-label="חיפוש"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        {/* תפריט למחשב */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          {navLinks.map((link, index) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group
                ${pathname === link.href 
                  ? 'text-primary bg-primary/5' 
                  : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                }`}
              onMouseEnter={() => setHoveredLink(index)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span className="relative z-10">{link.label}</span>
              {pathname === link.href ? (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/70 w-full scale-x-100"></div>
              ) : (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              )}
            </Link>
          ))}
        </nav>
        
        {/* פעולות נוספות */}
        <div className="hidden md:flex items-center space-x-1 space-x-reverse">
          <button 
            className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="חיפוש"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <Link 
            href="/cart" 
            className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="עגלת קניות"
          >
            <svg className="h-5 w-5 cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemsCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                {cartItemsCount}
              </div>
            )}
          </Link>
        </div>
      </div>
      
      {/* חיפוש שנפתח */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-start justify-center pt-16 sm:pt-24" onClick={() => setSearchOpen(false)}>
          <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-2xl mx-4 animate-[scaleIn_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">חיפוש מהיר</h3>
              <button 
                onClick={() => setSearchOpen(false)}
                className="mr-auto text-gray-500 hover:text-gray-800"
                aria-label="סגור חיפוש"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form 
              className="relative" 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
                  setSearchOpen(false);
                }
              }}
            >
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפשי מוצרים, קטגוריות או צבעים..."
                className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                aria-label="חפש"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">חיפושים פופולריים:</p>
              <div className="flex flex-wrap gap-2">
                {['שרשראות', 'צמידים', 'עגילים', 'טבעות', 'זהב', 'כסף', 'מתנות'].map((term) => (
                  <button 
                    key={term}
                    onClick={() => {
                      window.location.href = `/search?q=${encodeURIComponent(term)}`;
                      setSearchOpen(false);
                    }}
                    className="py-1 px-3 bg-gray-100 hover:bg-primary/10 text-sm rounded-full transition-colors duration-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 