"use client"

import { useState } from 'react'
import { categories } from '../lib/products'

export default function ProductFilter() {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  
  // חומרים אפשריים לסינון
  const availableMaterials = [
    { id: 'silver', name: 'כסף 925' },
    { id: 'gold', name: 'מצופה זהב' },
    { id: 'rosegold', name: 'זהב ורוד' },
    { id: 'pearls', name: 'פנינים' },
    { id: 'gemstones', name: 'אבני חן' },
  ];
  
  // טיפול בשינוי הטווח
  const handlePriceChange = (e, endpoint) => {
    const value = parseInt(e.target.value);
    if (endpoint === 'min') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };
  
  // טיפול בבחירת קטגוריה
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  // טיפול בבחירת חומר
  const handleMaterialChange = (materialId) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
  };
  
  // ניקוי כל הפילטרים
  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedMaterials([]);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">סנן לפי</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-primary hover:underline"
        >
          נקה הכל
        </button>
      </div>
      
      {/* סינון לפי טווח מחירים */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">טווח מחירים</h4>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">₪{priceRange[0]}</span>
            <span className="text-sm text-gray-600">₪{priceRange[1]}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={priceRange[1]} 
            onChange={(e) => handlePriceChange(e, 'max')}
            className="w-full accent-primary"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="min-price" className="sr-only">מחיר מינימלי</label>
              <input
                type="number"
                id="min-price"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 'min')}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="מינימום"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="max-price" className="sr-only">מחיר מקסימלי</label>
              <input
                type="number"
                id="max-price"
                min={priceRange[0]}
                max="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="מקסימום"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* סינון לפי קטגוריה */}
      <div className="mb-8">
        <h4 className="font-medium mb-4">קטגוריה</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="text-primary rounded focus:ring-primary ml-2"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* סינון לפי חומר */}
      <div className="mb-4">
        <h4 className="font-medium mb-4">חומר</h4>
        <div className="space-y-2">
          {availableMaterials.map(material => (
            <label key={material.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material.id)}
                onChange={() => handleMaterialChange(material.id)}
                className="text-primary rounded focus:ring-primary ml-2"
              />
              <span>{material.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <button className="btn-primary w-full mt-8">החל סינון</button>
    </div>
  )
} 