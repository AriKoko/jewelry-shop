"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function AdvancedSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  
  // קטגוריות לסינון
  const categories = [
    { id: 'bracelets', name: 'צמידים' },
    { id: 'necklaces', name: 'שרשראות' },
    { id: 'rings', name: 'טבעות' },
    { id: 'earrings', name: 'עגילים' },
    { id: 'sets', name: 'סטים' }
  ];
  
  // תגיות פופולריות
  const popularTags = [
    { id: 'golden', name: 'זהב' },
    { id: 'silver', name: 'כסף' },
    { id: 'handmade', name: 'עבודת יד' },
    { id: 'custom', name: 'מותאם אישית' },
    { id: 'gems', name: 'אבני חן' },
    { id: 'bestseller', name: 'רב מכר' },
    { id: 'new', name: 'חדש' },
    { id: 'sale', name: 'מבצע' }
  ];
  
  // אופציות מיון
  const sortOptions = [
    { id: 'featured', name: 'מובחרים' },
    { id: 'price_asc', name: 'מחיר: נמוך לגבוה' },
    { id: 'price_desc', name: 'מחיר: גבוה לנמוך' },
    { id: 'newest', name: 'חדש ביותר' },
    { id: 'alphabetical', name: 'שם: א-ת' }
  ];
  
  // שמירת ערכי החיפוש מה-URL בעת טעינת הקומפוננט
  useEffect(() => {
    // קבל פרמטרים מה-URL
    const query = searchParams.get('query') || '';
    const categories = searchParams.get('categories') || '';
    const tags = searchParams.get('tags') || '';
    const min = searchParams.get('min') || '';
    const max = searchParams.get('max') || '';
    const sort = searchParams.get('sort') || 'featured';
    
    // הגדר את המצב הפנימי בהתאם לפרמטרים
    setSearchTerm(query);
    setSelectedCategories(categories ? categories.split(',') : []);
    setSelectedTags(tags ? tags.split(',') : []);
    setPriceRange({ min, max });
    setSortBy(sort);
  }, [searchParams]);
  
  // טיפול בשינוי קטגוריות
  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // טיפול בשינוי תגיות
  const handleTagChange = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  // בניית מחרוזת חיפוש לשימוש ב-URL
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('query', searchTerm);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (priceRange.min) params.set('min', priceRange.min);
    if (priceRange.max) params.set('max', priceRange.max);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    return params.toString();
  };
  
  // שליחת החיפוש
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    
    // בנה מחרוזת פרמטרים 
    const queryString = buildQueryString();
    
    // נווט לדף הקולקציה עם הפרמטרים
    router.push(`/collection${queryString ? `?${queryString}` : ''}`);
    
    // סגור את חלונית החיפוש אם היא פתוחה
    setIsOpen(false);
  };
  
  // איפוס הסינון
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
    
    // נווט בחזרה לדף הקולקציה ללא פרמטרים
    router.push('/collection');
    
    // סגור את חלונית החיפוש אם היא פתוחה
    setIsOpen(false);
  };
  
  // סטיילינג
  const buttonActiveStyle = 'bg-primary text-white border-primary';
  const buttonInactiveStyle = 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary transition';
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all">
      {/* טופס חיפוש מהיר */}
      <div className="p-4">
        <form onSubmit={handleSubmitSearch} className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="חיפוש מוצרים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-right"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-2 border rounded-lg flex items-center gap-1 
              ${isOpen ? buttonActiveStyle : buttonInactiveStyle}`}
            aria-expanded={isOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>סינון</span>
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            חפש
          </button>
        </form>
        
        {/* תגיות סינון פעילות */}
        {(selectedCategories.length > 0 || selectedTags.length > 0 || 
          priceRange.min || priceRange.max || searchTerm || sortBy !== 'featured') && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">סינון פעיל:</span>
            
            {searchTerm && (
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center">
                {searchTerm}
                <button onClick={() => setSearchTerm('')} className="mr-1 text-gray-500 hover:text-gray-700">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {selectedCategories.map(catId => {
              const category = categories.find(c => c.id === catId);
              return category ? (
                <span key={catId} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center">
                  {category.name}
                  <button onClick={() => handleCategoryChange(catId)} className="mr-1 text-gray-500 hover:text-gray-700">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ) : null;
            })}
            
            {selectedTags.map(tagId => {
              const tag = popularTags.find(t => t.id === tagId);
              return tag ? (
                <span key={tagId} className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full flex items-center">
                  {tag.name}
                  <button onClick={() => handleTagChange(tagId)} className="mr-1 text-gray-500 hover:text-gray-700">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ) : null;
            })}
            
            {(priceRange.min || priceRange.max) && (
              <span className="text-xs bg-accent/10 text-accent-dark px-3 py-1 rounded-full flex items-center">
                {priceRange.min && priceRange.max 
                  ? `₪${priceRange.min} - ₪${priceRange.max}`
                  : priceRange.min 
                    ? `מ-₪${priceRange.min}`
                    : `עד ₪${priceRange.max}`
                }
                <button onClick={() => setPriceRange({ min: '', max: '' })} className="mr-1 text-gray-500 hover:text-gray-700">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {sortBy !== 'featured' && (
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
                מיון: {sortOptions.find(opt => opt.id === sortBy)?.name}
                <button onClick={() => setSortBy('featured')} className="mr-1 text-gray-500 hover:text-gray-700">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            <button 
              onClick={handleReset} 
              className="text-xs text-gray-600 hover:text-primary transition-colors"
            >
              נקה הכל
            </button>
          </div>
        )}
      </div>
      
      {/* חיפוש מתקדם פתוח */}
      {isOpen && (
        <div className="border-t border-gray-100 p-4 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* קטגוריות */}
            <div>
              <h3 className="font-medium mb-3">קטגוריות</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`cat-${category.id}`} className="mr-2 text-gray-700 text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* תגיות */}
            <div>
              <h3 className="font-medium mb-3">תגיות פופולריות</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagChange(tag.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-secondary hover:text-secondary'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* מחיר ומיון */}
            <div>
              <div className="mb-4">
                <h3 className="font-medium mb-3">טווח מחירים</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="מ-"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-right"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="עד"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-right"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">מיון לפי</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-right appearance-none bg-arrow-down bg-no-repeat bg-[left_10px_center]"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              נקה הכל
            </button>
            
            <button
              type="button"
              onClick={handleSubmitSearch}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              החל סינון
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 