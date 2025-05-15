"use client";

import { useState, useEffect } from 'react';
import { 
  fetchProducts, updateProduct, deleteProduct, createProduct, 
  fetchOrders, updateOrder,
  fetchCustomItems, updateCustomItem, deleteCustomItem, createCustomItem,
  getCharms, getCharm, createCharm, updateCharm, deleteCharm,
  uploadImage, deleteImage
} from '../../lib/api';
import { categories } from '../../lib/products';
import { OrderItemRow } from '../../components/OrderItemRow';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [backupError, setBackupError] = useState(null);
  const [restoreError, setRestoreError] = useState(null);
  const [backupSuccess, setBackupSuccess] = useState(null);
  const [restoreSuccess, setRestoreSuccess] = useState(null);
  
  // פונקציה להורדת גיבוי
  const handleBackup = async () => {
    setBackupLoading(true);
    setBackupError(null);
    setBackupSuccess(null);
    try {
      const res = await fetch('/api/admin/db-backup');
      if (!res.ok) throw new Error('שגיאה בגיבוי הדאטהבייס');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mongo-backup.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setBackupSuccess('הגיבוי ירד בהצלחה!');
    } catch (err) {
      setBackupError(err.message);
    } finally {
      setBackupLoading(false);
    }
  };

  // פונקציה להעלאת גיבוי ושחזור
  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setRestoreLoading(true);
    setRestoreError(null);
    setRestoreSuccess(null);
    try {
      const formData = new FormData();
      formData.append('backup', file);
      const res = await fetch('/api/admin/db-restore', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('שגיאה בשחזור הדאטהבייס');
      setRestoreSuccess('הדאטהבייס שוחזר בהצלחה!');
    } catch (err) {
      setRestoreError(err.message);
    } finally {
      setRestoreLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">פאנל ניהול</h1>
      
      {/* כפתורי גיבוי ושחזור */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
          onClick={handleBackup}
          disabled={backupLoading}
        >
          {backupLoading ? 'מגבה...' : 'גיבוי והורדת הדאטהבייס'}
        </button>
        <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded cursor-pointer disabled:opacity-50">
          {restoreLoading ? 'משחזר...' : 'שחזור/העלאת דאטהבייס'}
          <input
            type="file"
            accept=".zip,.bson,.gz"
            onChange={handleRestore}
            className="hidden"
            disabled={restoreLoading}
          />
        </label>
      </div>
      {backupError && <div className="text-center text-red-500 mb-2">{backupError}</div>}
      {backupSuccess && <div className="text-center text-green-600 mb-2">{backupSuccess}</div>}
      {restoreError && <div className="text-center text-red-500 mb-2">{restoreError}</div>}
      {restoreSuccess && <div className="text-center text-green-600 mb-2">{restoreSuccess}</div>}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* לשוניות ניווט */}
        <div className="flex border-b flex-wrap">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'inventory' ? 'bg-primary text-white' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            ניהול מלאי
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'charms' ? 'bg-primary text-white' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('charms')}
          >
            ניהול תליונים
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'homepage' ? 'bg-primary text-white' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('homepage')}
          >
            תמונות דף הבית
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'customDesign' ? 'bg-primary text-white' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('customDesign')}
          >
            תמונות עיצוב אישי
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            הזמנות שהתקבלו
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'messages' ? 'bg-primary text-white' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            הודעות מלקוחות
          </button>
          <Link
            href="/admin/coupons"
            className="flex-1 py-4 px-6 text-center font-medium hover:bg-gray-50"
          >
            ניהול קופונים
          </Link>
        </div>
        
        {/* תוכן לשוניות */}
        <div className="p-6">
          {activeTab === 'inventory' ? (
            <InventoryManager />
          ) : activeTab === 'charms' ? (
            <CharmsManager />
          ) : activeTab === 'orders' ? (
            <OrdersViewer />
          ) : activeTab === 'homepage' ? (
            <HomepageImagesManager />
          ) : activeTab === 'customDesign' ? (
            <CustomDesignImagesManager />
          ) : (
            <MessagesViewer />
          )}
        </div>
      </div>
    </div>
  );
}

// קומפוננטת ניהול מלאי
function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCustomItem, setEditingCustomItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isNewCustomItem, setIsNewCustomItem] = useState(false);
  const [inventoryView, setInventoryView] = useState('products'); // 'products' או 'customItems'

  useEffect(() => {
    if (inventoryView === 'products') {
      loadProducts();
    } else {
      loadCustomItems();
    }
  }, [inventoryView]);

  const loadProducts = async (category = null) => {
    try {
      setLoading(true);
      const productsData = await fetchProducts(category !== 'all' ? category : null);
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('אירעה שגיאה בטעינת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomItems = async (type = null) => {
    try {
      setLoading(true);
      const customItemsData = await fetchCustomItems(type !== 'all' ? type : null);
      setCustomItems(customItemsData);
      setError(null);
    } catch (err) {
      console.error('Error loading custom items:', err);
      setError('אירעה שגיאה בטעינת הפריטים המותאמים אישית');
    } finally {
      setLoading(false);
    }
  };
  
  // סינון מוצרים לפי קטגוריה
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // סינון פריטים מותאמים אישית לפי סוג
  const filteredCustomItems = selectedCategory === 'all'
    ? customItems
    : customItems.filter(item => item.type === selectedCategory);
  
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (inventoryView === 'products') {
      loadProducts(category);
    } else {
      loadCustomItems(category);
    }
  };

  const handleViewChange = (view) => {
    setInventoryView(view);
    setSelectedCategory('all');
    setEditingProduct(null);
    setEditingCustomItem(null);
    setIsNewProduct(false);
    setIsNewCustomItem(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct({...product});
    setIsNewProduct(false);
    setEditingCustomItem(null);
  };

  const handleEditCustomItem = (customItem) => {
    setEditingCustomItem({...customItem});
    setIsNewCustomItem(false);
    setEditingProduct(null);
  };

  const handleAddNewProduct = () => {
    setEditingProduct({
      name: '',
      price: 0,
      discountPrice: null,
      description: '',
      material: '',
      category: 'necklaces',
      image: '/images/products/placeholder.jpg',
      tags: [],
      featured: false,
      stock: 0
    });
    setIsNewProduct(true);
    setEditingCustomItem(null);
  };

  const handleAddNewCustomItem = () => {
    setEditingCustomItem({
      type: 'bracelet',
      name: '',
      basePrice: 0,
      baseType: '',
      material: '',
      description: '',
      images: ['/images/custom-items/placeholder.jpg'],
      featured: false,
      active: true
    });
    setIsNewCustomItem(true);
    setEditingProduct(null);
  };
  
  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditingProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) :
              value
    }));
  };

  const handleCustomItemInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditingCustomItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) :
              value
    }));
  };
  
  const handleSaveProduct = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      
      if (isNewProduct) {
        await createProduct(editingProduct);
      } else {
        await updateProduct(editingProduct._id, editingProduct);
      }
      
      await loadProducts(selectedCategory !== 'all' ? selectedCategory : null);
      setEditingProduct(null);
      alert(isNewProduct ? 'המוצר נוצר בהצלחה!' : 'המוצר נשמר בהצלחה!');
    } catch (err) {
      console.error('Error saving product:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomItem = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      
      if (isNewCustomItem) {
        await createCustomItem(editingCustomItem);
      } else {
        await updateCustomItem(editingCustomItem._id, editingCustomItem);
      }
      
      await loadCustomItems(selectedCategory !== 'all' ? selectedCategory : null);
      setEditingCustomItem(null);
      alert(isNewCustomItem ? 'הפריט המותאם אישית נוצר בהצלחה!' : 'הפריט המותאם אישית נשמר בהצלחה!');
    } catch (err) {
      console.error('Error saving custom item:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('האם את/ה בטוח/ה שברצונך למחוק מוצר זה?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(productId);
      await loadProducts(selectedCategory !== 'all' ? selectedCategory : null);
      alert('המוצר נמחק בהצלחה!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomItem = async (customItemId) => {
    if (!confirm('האם את/ה בטוח/ה שברצונך למחוק פריט מותאם אישית זה?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteCustomItem(customItemId);
      await loadCustomItems(selectedCategory !== 'all' ? selectedCategory : null);
      alert('הפריט המותאם אישית נמחק בהצלחה!');
    } catch (err) {
      console.error('Error deleting custom item:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && products.length === 0 && customItems.length === 0) {
    return <div className="text-center py-8">טוען...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  // טופס עריכת מוצר
  if (editingProduct) {
    return (
      <div>
        <button 
          onClick={() => setEditingProduct(null)} 
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          חזרה לרשימת המוצרים
        </button>
        
        <h2 className="text-xl font-semibold mb-4">{isNewProduct ? 'הוספת מוצר חדש' : 'עריכת מוצר'}</h2>
        
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם המוצר</label>
              <input
                type="text"
                name="name"
                value={editingProduct.name || ''}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
              <select
                name="category"
                value={editingProduct.category || ''}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מחיר</label>
              <input
                type="number"
                name="price"
                value={editingProduct.price || 0}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מחיר מבצע (לא חובה)</label>
              <input
                type="number"
                name="discountPrice"
                value={editingProduct.discountPrice || ''}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">חומר</label>
              <input
                type="text"
                name="material"
                value={editingProduct.material || ''}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כמות במלאי</label>
              <input
                type="number"
                name="stock"
                value={editingProduct.stock || 0}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תמונה (URL)</label>
              <input
                type="text"
                name="image"
                value={editingProduct.image || ''}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                required
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">או העלה תמונה</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        setLoading(true);
                        const formData = new FormData();
                        formData.append('file', e.target.files[0]);
                        
                        const imageUrl = await uploadImage(formData);
                        setEditingProduct({...editingProduct, image: imageUrl});
                        
                      } catch (err) {
                        console.error('שגיאה בהעלאת התמונה:', err);
                        alert(`שגיאה: ${err.message}`);
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="w-full border rounded-md p-2"
                />
              </div>
              {editingProduct.image && (
                <div className="mt-2 relative">
                  <img 
                    src={editingProduct.image} 
                    alt="תצוגה מקדימה" 
                    className="w-32 h-32 object-cover border rounded-md" 
                  />
                  {editingProduct.image.startsWith('/images/uploads/') && (
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
                          try {
                            setLoading(true);
                            await deleteImage(editingProduct.image);
                            setEditingProduct({...editingProduct, image: ''});
                            alert('התמונה נמחקה בהצלחה');
                          } catch (err) {
                            console.error('שגיאה במחיקת התמונה:', err);
                            alert(`שגיאה: ${err.message}`);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      title="מחק תמונה"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תגיות (מופרדות בפסיק)</label>
              <input
                type="text"
                name="tags"
                value={Array.isArray(editingProduct.tags) ? editingProduct.tags.join(',') : ''}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  setEditingProduct({...editingProduct, tags});
                }}
                className="w-full border rounded-md p-2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                name="description"
                value={editingProduct.description || ''}
                onChange={handleProductInputChange}
                className="w-full border rounded-md p-2"
                rows="4"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={editingProduct.featured || false}
                  onChange={handleProductInputChange}
                  className="ml-2"
                />
                <span>הצג בדף הבית (מוצר מומלץ)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded ml-2"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // טופס עריכת פריט מותאם אישית
  if (editingCustomItem) {
    return (
      <div>
        <button 
          onClick={() => setEditingCustomItem(null)} 
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          חזרה לרשימת הפריטים המותאמים אישית
        </button>
        
        <h2 className="text-xl font-semibold mb-4">{isNewCustomItem ? 'הוספת פריט מותאם אישית חדש' : 'עריכת פריט מותאם אישית'}</h2>
        
        <form onSubmit={handleSaveCustomItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם הפריט</label>
              <input
                type="text"
                name="name"
                value={editingCustomItem.name || ''}
                onChange={handleCustomItemInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוג פריט</label>
              <select
                name="type"
                value={editingCustomItem.type || ''}
                onChange={handleCustomItemInputChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="bracelet">צמיד</option>
                <option value="necklace">שרשרת</option>
                <option value="earrings">עגילים</option>
                <option value="ring">טבעת</option>
                <option value="other">אחר</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מחיר בסיס</label>
              <input
                type="number"
                name="basePrice"
                value={editingCustomItem.basePrice || 0}
                onChange={handleCustomItemInputChange}
                className="w-full border rounded-md p-2"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">חומר</label>
              <input
                type="text"
                name="material"
                value={editingCustomItem.material || ''}
                onChange={handleCustomItemInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תמונה ראשית (URL)</label>
              <input
                type="text"
                name="images"
                value={editingCustomItem.images?.[0] || ''}
                onChange={(e) => {
                  const images = [...(editingCustomItem.images || [])];
                  images[0] = e.target.value;
                  setEditingCustomItem({...editingCustomItem, images});
                }}
                className="w-full border rounded-md p-2"
                required
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">או העלה תמונה</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        setLoading(true);
                        const formData = new FormData();
                        formData.append('file', e.target.files[0]);
                        
                        const imageUrl = await uploadImage(formData);
                        const images = [...(editingCustomItem.images || [])];
                        images[0] = imageUrl;
                        setEditingCustomItem({...editingCustomItem, images});
                        
                      } catch (err) {
                        console.error('שגיאה בהעלאת התמונה:', err);
                        alert(`שגיאה: ${err.message}`);
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="w-full border rounded-md p-2"
                />
              </div>
              {editingCustomItem.images?.[0] && (
                <div className="mt-2 relative">
                  <img 
                    src={editingCustomItem.images[0]} 
                    alt="תצוגה מקדימה" 
                    className="w-32 h-32 object-cover border rounded-md" 
                  />
                  {editingCustomItem.images[0].startsWith('/images/uploads/') && (
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
                          try {
                            setLoading(true);
                            await deleteImage(editingCustomItem.images[0]);
                            const images = [...(editingCustomItem.images || [])];
                            images[0] = '';
                            setEditingCustomItem({...editingCustomItem, images});
                            alert('התמונה נמחקה בהצלחה');
                          } catch (err) {
                            console.error('שגיאה במחיקת התמונה:', err);
                            alert(`שגיאה: ${err.message}`);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      title="מחק תמונה"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                name="description"
                value={editingCustomItem.description || ''}
                onChange={handleCustomItemInputChange}
                className="w-full border rounded-md p-2"
                rows="4"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={editingCustomItem.featured || false}
                  onChange={handleCustomItemInputChange}
                  className="ml-2"
                />
                <span>הצג בדף הבית (מוצר מומלץ)</span>
              </label>
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={editingCustomItem.active || false}
                  onChange={handleCustomItemInputChange}
                  className="ml-2"
                />
                <span>פעיל (זמין לרכישה)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setEditingCustomItem(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded ml-2"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">ניהול מלאי</h2>
        
        <div className="flex items-center space-x-4">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={inventoryView === 'products' ? handleAddNewProduct : handleAddNewCustomItem}
          >
            {inventoryView === 'products' ? 'מוצר חדש' : 'פריט מותאם אישית חדש'}
          </button>
          
          <div className="flex items-center mr-4">
            <span className="ml-2">סנן לפי:</span>
            <select 
              className="border rounded p-2" 
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">הכל</option>
              {inventoryView === 'products' ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))
              ) : (
                <>
                  <option value="bracelet">צמידים</option>
                  <option value="necklace">שרשראות</option>
                  <option value="earrings">עגילים</option>
                  <option value="ring">טבעות</option>
                  <option value="other">אחר</option>
                </>
              )}
            </select>
          </div>
          
          <div className="flex space-x-2 mr-4">
            <button
              className={`px-3 py-1 rounded ${inventoryView === 'products' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => handleViewChange('products')}
            >
              מוצרים רגילים
            </button>
            <button
              className={`px-3 py-1 rounded ${inventoryView === 'customItems' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              onClick={() => handleViewChange('customItems')}
            >
              פריטים מותאמים אישית
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {inventoryView === 'products' ? (
          // טבלת מוצרים רגילים
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם מוצר</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">קטגוריה</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מחיר</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מלאי</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מומלץ</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-full object-cover ml-2" />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {categories.find(c => c.id === product.category)?.label || product.category}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="font-medium">₪{product.price}</div>
                      {product.discountPrice && <div className="text-sm line-through text-gray-500">₪{product.discountPrice}</div>}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.stock > 10 ? 'bg-green-100 text-green-800' : 
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {product.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          כן
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          לא
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button 
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          ערוך
                        </button>
                        <button 
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          הסר
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border p-4 text-center text-gray-500">
                    {loading ? 'טוען מוצרים...' : 'לא נמצאו מוצרים בקטגוריה זו'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          // טבלת פריטים מותאמים אישית
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם פריט</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סוג</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מחיר בסיס</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מומלץ</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעיל</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomItems.length > 0 ? (
                filteredCustomItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '/images/custom-items/placeholder.jpg'} 
                          alt={item.name} 
                          className="h-10 w-10 rounded-full object-cover ml-2"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {item.type === 'bracelet' ? 'צמיד' : 
                       item.type === 'necklace' ? 'שרשרת' :
                       item.type === 'earrings' ? 'עגילים' :
                       item.type === 'ring' ? 'טבעת' : 'אחר'}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="font-medium">₪{item.basePrice}</div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {item.featured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          כן
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          לא
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      {item.active ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          כן
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          לא
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button 
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
                          onClick={() => handleEditCustomItem(item)}
                        >
                          ערוך
                        </button>
                        <button 
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                          onClick={() => handleDeleteCustomItem(item._id)}
                        >
                          הסר
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border p-4 text-center text-gray-500">
                    {loading ? 'טוען פריטים מותאמים אישית...' : 'לא נמצאו פריטים מותאמים אישית בקטגוריה זו'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// קומפוננטת צפייה בהזמנות
function OrdersViewer() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (status = null) => {
    try {
      setLoading(true);
      const ordersData = await fetchOrders(status);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('אירעה שגיאה בטעינת ההזמנות');
    } finally {
      setLoading(false);
    }
  };
  
  // סינון הזמנות לפי סטטוס
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    loadOrders(status !== 'all' ? status : null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrder(orderId, { status: newStatus });
      await loadOrders(statusFilter !== 'all' ? statusFilter : null);
      alert('סטטוס ההזמנה עודכן בהצלחה!');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return { text: 'ממתין לטיפול', color: 'bg-yellow-100 text-yellow-800' };
      case 'processing': return { text: 'בטיפול', color: 'bg-blue-100 text-blue-800' };
      case 'ready': return { text: 'מוכן לאיסוף', color: 'bg-green-100 text-green-800' };
      case 'completed': return { text: 'הושלם', color: 'bg-gray-100 text-gray-800' };
      case 'cancelled': return { text: 'בוטל', color: 'bg-red-100 text-red-800' };
      default: return { text: 'לא ידוע', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading && orders.length === 0) {
    return <div className="text-center py-8">טוען...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">הזמנות שהתקבלו</h2>
        
        <div className="flex items-center">
          <span className="ml-2">סנן לפי סטטוס:</span>
          <select 
            className="border rounded p-2" 
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">כל ההזמנות</option>
            <option value="pending">ממתין לטיפול</option>
            <option value="processing">בטיפול</option>
            <option value="ready">מוכן לאיסוף</option>
            <option value="completed">הושלם</option>
            <option value="cancelled">בוטל</option>
          </select>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {loading ? 'טוען הזמנות...' : 'לא נמצאו הזמנות בסטטוס זה'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div 
              key={order._id} 
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium">הזמנה מס׳ {order._id.substring(order._id.length - 8)}</div>
                  <div className="text-sm text-gray-600">{order.customerName} | {order.customerPhone}</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="font-medium">₪{order.total}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  
                  <div className={`py-1 px-3 rounded-full text-sm ${getStatusLabel(order.status).color}`}>
                    {getStatusLabel(order.status).text}
                  </div>
                  
                  <div className="text-gray-400">
                    {expandedOrder === order._id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              
              {expandedOrder === order._id && (
                <div className="p-4 bg-gray-50 border-t">
                  <h3 className="font-medium mb-2">פריטים בהזמנה</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם פריט</th>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פרטים</th>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מחיר</th>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">כמות</th>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סה״כ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                          <OrderItemRow key={index} item={item} />
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan="4" className="py-2 px-4 text-right font-medium">סה״כ</td>
                          <td className="py-2 px-4 font-bold">₪{order.total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {order.notes && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-1">הערות</h3>
                      <div className="bg-white p-3 rounded border whitespace-pre-wrap">{order.notes}</div>
                    </div>
                  )}

                  {order.shippingDetails && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-1">פרטי משלוח</h3>
                      <div className="bg-white p-3 rounded border">
                        <p><span className="font-medium">כתובת: </span>{order.shippingDetails.address}</p>
                        {order.shippingDetails.city && <p><span className="font-medium">עיר: </span>{order.shippingDetails.city}</p>}
                        {order.shippingDetails.postalCode && <p><span className="font-medium">מיקוד: </span>{order.shippingDetails.postalCode}</p>}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="font-medium mb-1">עדכון סטטוס</h3>
                      <select 
                        className="border rounded p-2" 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={loading}
                      >
                        <option value="pending">ממתין לטיפול</option>
                        <option value="processing">בטיפול</option>
                        <option value="ready">מוכן לאיסוף</option>
                        <option value="completed">הושלם</option>
                        <option value="cancelled">בוטל</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// קומפוננטת צפייה בהודעות
function MessagesViewer() {
  const [messages, setMessages] = useState([]);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async (status = null) => {
    try {
      setLoading(true);
      
      // קריאת הודעות מהלוקל סטורג'
      const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      
      // הפיכת תאריכים לאובייקטי Date
      const messagesWithDates = savedMessages.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }));
      
      // מיון לפי תאריך יצירה (החדש ביותר קודם)
      const sortedMessages = messagesWithDates.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
      
      // סינון לפי סטטוס אם צריך
      const filteredMessages = status ? 
        sortedMessages.filter(msg => msg.status === status) :
        sortedMessages;
      
      setMessages(filteredMessages);
      setError(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('אירעה שגיאה בטעינת ההודעות');
      
      // בחזרה לנתוני דוגמה במקרה של שגיאה
      const mockMessages = [
        {
          _id: '1',
          name: 'אביה כהן',
          email: 'avia@example.com',
          phone: '050-1234567',
          subject: 'שאלה על מוצר',
          message: 'שלום, אני מעוניינת לדעת האם יש אפשרות להזמין שרשרת בצבע זהב עם תליון מיוחד שלא מופיע באתר?',
          createdAt: new Date('2023-06-15T10:30:00'),
          status: 'new'
        },
        {
          _id: '2',
          name: 'רותם לוי',
          email: 'rotem@example.com',
          phone: '052-9876543',
          subject: 'מידע על הזמנה',
          message: 'הי, הזמנתי לפני יומיים שרשרת מעוצבת אישית (הזמנה מספר 12345) ורציתי לדעת מתי בערך היא תהיה מוכנה לאיסוף?',
          createdAt: new Date('2023-06-14T15:45:00'),
          status: 'read'
        },
        {
          _id: '3',
          name: 'נעמה שמואלי',
          email: 'naama@example.com',
          phone: '054-5555555',
          subject: 'עיצוב מותאם אישית',
          message: 'שלום, אני מחפשת עיצוב מיוחד לחברה שלי ליום הולדת. האם אפשר לקבוע פגישה לדבר על אפשרויות?',
          createdAt: new Date('2023-06-13T09:15:00'),
          status: 'new'
        }
      ];
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };
  
  // סינון הודעות לפי סטטוס
  const filteredMessages = statusFilter === 'all' 
    ? messages 
    : messages.filter(message => message.status === statusFilter);
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMessageStatusChange = async (messageId, newStatus) => {
    try {
      // עדכון סטטוס בלוקל סטורג'
      const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      
      // עדכון הסטטוס של ההודעה הספציפית
      const updatedMessages = savedMessages.map(msg => 
        msg._id === messageId ? {...msg, status: newStatus} : msg
      );
      
      // שמירה חזרה ללוקל סטורג'
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
      
      // עדכון ב-state
      setMessages(prevMessages => prevMessages.map(msg => 
        msg._id === messageId ? {...msg, status: newStatus} : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
      alert('אירעה שגיאה בעדכון סטטוס ההודעה');
    }
  };
  
  if (loading && messages.length === 0) {
    return <div className="text-center py-8">טוען...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">הודעות מלקוחות</h2>
        
        <div className="flex items-center">
          <span className="ml-2">סנן לפי סטטוס:</span>
          <select 
            className="border rounded p-2" 
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">כל ההודעות</option>
            <option value="new">הודעות חדשות</option>
            <option value="read">הודעות שנקראו</option>
          </select>
        </div>
      </div>
      
      {filteredMessages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {loading ? 'טוען הודעות...' : 'לא נמצאו הודעות בסטטוס זה'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map(message => (
            <div 
              key={message._id} 
              className={`border rounded-lg overflow-hidden ${message.status === 'new' ? 'border-primary' : ''}`}
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedMessage(expandedMessage === message._id ? null : message._id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{message.name} - {message.subject}</div>
                  <div className="text-sm text-gray-600">{message.message}</div>
                </div>
                
                <div className="text-gray-400">
                  {expandedMessage === message._id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              {expandedMessage === message._id && (
                <div className="p-4 bg-gray-50 border-t">
                  <h3 className="font-medium mb-2">פרטי ההודעה</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פרט</th>
                          <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ערך</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-2 px-4 whitespace-nowrap">שם</td>
                          <td className="py-2 px-4 whitespace-nowrap">{message.name}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 whitespace-nowrap">אימייל</td>
                          <td className="py-2 px-4 whitespace-nowrap">{message.email}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 whitespace-nowrap">טלפון</td>
                          <td className="py-2 px-4 whitespace-nowrap">{message.phone}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 whitespace-nowrap">הודעה</td>
                          <td className="py-2 px-4 whitespace-nowrap">{message.message}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 whitespace-nowrap">תאריך</td>
                          <td className="py-2 px-4 whitespace-nowrap">{new Date(message.createdAt).toLocaleDateString('he-IL')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="font-medium mb-1">עדכון סטטוס</h3>
                      <select 
                        className="border rounded p-2" 
                        value={message.status}
                        onChange={(e) => handleMessageStatusChange(message._id, e.target.value)}
                        disabled={loading}
                      >
                        <option value="new">חדש</option>
                        <option value="read">נקרא</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// קומפוננטת ניהול תליונים
function CharmsManager() {
  const [charms, setCharms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingCharm, setEditingCharm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewCharm, setIsNewCharm] = useState(false);

  useEffect(() => {
    loadCharms();
  }, []);

  const loadCharms = async (category = null) => {
    try {
      setLoading(true);
      const charmsData = await getCharms(category !== 'all' ? { category } : {});
      setCharms(charmsData);
      setError(null);
    } catch (err) {
      console.error('Error loading charms:', err);
      setError('אירעה שגיאה בטעינת התליונים');
    } finally {
      setLoading(false);
    }
  };
  
  // סינון תליונים לפי קטגוריה
  const filteredCharms = selectedCategory === 'all' 
    ? charms 
    : charms.filter(charm => charm.category === selectedCategory);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category !== 'all') {
      loadCharms(category);
    } else {
      loadCharms();
    }
  };

  const handleEditCharm = (charm) => {
    setEditingCharm({...charm});
    setIsNewCharm(false);
  };

  const handleAddNewCharm = () => {
    setEditingCharm({
      name: '',
      price: 0,
      description: '',
      material: '',
      category: 'gold',
      image: '/images/charms/placeholder.jpg',
      stock: 0,
      active: true
    });
    setIsNewCharm(true);
  };
  
  const handleCharmInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditingCharm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) :
              value
    }));
  };
  
  const handleSaveCharm = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);
      
      if (isNewCharm) {
        await createCharm(editingCharm);
      } else {
        await updateCharm(editingCharm._id, editingCharm);
      }
      
      await loadCharms(selectedCategory !== 'all' ? selectedCategory : null);
      setEditingCharm(null);
      alert(isNewCharm ? 'התליון נוצר בהצלחה!' : 'התליון נשמר בהצלחה!');
    } catch (err) {
      console.error('Error saving charm:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharm = async (charmId) => {
    if (!confirm('האם את/ה בטוח/ה שברצונך למחוק תליון זה?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteCharm(charmId);
      await loadCharms(selectedCategory !== 'all' ? selectedCategory : null);
      alert('התליון נמחק בהצלחה!');
    } catch (err) {
      console.error('Error deleting charm:', err);
      alert(`שגיאה: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && charms.length === 0) {
    return <div className="text-center py-8">טוען...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  // טופס עריכת תליון
  if (editingCharm) {
    return (
      <div>
        <button 
          onClick={() => setEditingCharm(null)} 
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          חזרה לרשימת התליונים
        </button>
        
        <h2 className="text-xl font-semibold mb-4">{isNewCharm ? 'הוספת תליון חדש' : 'עריכת תליון'}</h2>
        
        <form onSubmit={handleSaveCharm} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם התליון</label>
              <input
                type="text"
                name="name"
                value={editingCharm.name || ''}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
              <select
                name="category"
                value={editingCharm.category || ''}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="gold">זהב</option>
                <option value="silver">כסף</option>
                <option value="mixed">מעורב</option>
                <option value="other">אחר</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מחיר</label>
              <input
                type="number"
                name="price"
                value={editingCharm.price || 0}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">חומר</label>
              <input
                type="text"
                name="material"
                value={editingCharm.material || ''}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">כמות במלאי</label>
              <input
                type="number"
                name="stock"
                value={editingCharm.stock || 0}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תמונה (URL)</label>
              <input
                type="text"
                name="image"
                value={editingCharm.image || ''}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                required
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">או העלה תמונה</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        setLoading(true);
                        const formData = new FormData();
                        formData.append('file', e.target.files[0]);
                        
                        const imageUrl = await uploadImage(formData);
                        setEditingCharm({...editingCharm, image: imageUrl});
                        
                      } catch (err) {
                        console.error('שגיאה בהעלאת התמונה:', err);
                        alert(`שגיאה: ${err.message}`);
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="w-full border rounded-md p-2"
                />
              </div>
              {editingCharm.image && (
                <div className="mt-2 relative">
                  <img 
                    src={editingCharm.image} 
                    alt="תצוגה מקדימה" 
                    className="w-32 h-32 object-cover border rounded-md" 
                  />
                  {editingCharm.image.startsWith('/images/uploads/') && (
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
                          try {
                            setLoading(true);
                            await deleteImage(editingCharm.image);
                            setEditingCharm({...editingCharm, image: ''});
                            alert('התמונה נמחקה בהצלחה');
                          } catch (err) {
                            console.error('שגיאה במחיקת התמונה:', err);
                            alert(`שגיאה: ${err.message}`);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      title="מחק תמונה"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
              <textarea
                name="description"
                value={editingCharm.description || ''}
                onChange={handleCharmInputChange}
                className="w-full border rounded-md p-2"
                rows="4"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={editingCharm.active || false}
                  onChange={handleCharmInputChange}
                  className="ml-2"
                />
                <span>פעיל (זמין לבחירה)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setEditingCharm(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded ml-2"
              disabled={loading}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">ניהול תליונים</h2>
        
        <div className="flex items-center space-x-4">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            onClick={handleAddNewCharm}
          >
            תליון חדש
          </button>
          
          <div className="flex items-center mr-4">
            <span className="ml-2">סנן לפי:</span>
            <select 
              className="border rounded p-2" 
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">הכל</option>
              <option value="gold">זהב</option>
              <option value="silver">כסף</option>
              <option value="mixed">מעורב</option>
              <option value="other">אחר</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם תליון</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">קטגוריה</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מחיר</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מלאי</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעיל</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCharms.length > 0 ? (
              filteredCharms.map((charm) => (
                <tr key={charm._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={charm.image} alt={charm.name} className="h-10 w-10 rounded-full object-cover ml-2" />
                      <div>
                        <div className="font-medium text-gray-900">{charm.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {charm.category === 'gold' ? 'זהב' : 
                     charm.category === 'silver' ? 'כסף' :
                     charm.category === 'mixed' ? 'מעורב' : 'אחר'}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="font-medium">₪{charm.price}</div>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${charm.stock > 10 ? 'bg-green-100 text-green-800' : 
                        charm.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {charm.stock}
                    </span>
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    {charm.active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        כן
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        לא
                      </span>
                    )}
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
                        onClick={() => handleEditCharm(charm)}
                      >
                        ערוך
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
                        onClick={() => handleDeleteCharm(charm._id)}
                      >
                        הסר
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border p-4 text-center text-gray-500">
                  {loading ? 'טוען תליונים...' : 'לא נמצאו תליונים בקטגוריה זו'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// קומפוננטת ניהול תמונות דף הבית
function HomepageImagesManager() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchHomepageImages();
  }, []);

  const fetchHomepageImages = async () => {
    try {
      setLoading(true);
      // כעת נשתמש ב-API החדש שיצרנו
      const response = await fetch('/api/homepage/images');
      
      if (response.ok) {
        const data = await response.json();
        setHomepageImages(data);
        setError(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בטעינת תמונות דף הבית');
      }
    } catch (err) {
      console.error('Error fetching homepage images:', err);
      setError('אירעה שגיאה בטעינת תמונות דף הבית');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event, imageKey, categoryKey = null) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      // העלאת התמונה לשרת
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'שגיאה בהעלאת התמונה');
      }
      
      const { imageUrl: uploadedImageUrl } = await uploadResponse.json();
      
      // עדכון מצב התמונות
      setHomepageImages(prev => {
        if (categoryKey) {
          return {
            ...prev,
            categories: {
              ...prev.categories,
              [categoryKey]: uploadedImageUrl
            }
          };
        } else {
          return {
            ...prev,
            [imageKey]: uploadedImageUrl
          };
        }
      });

      setSuccessMessage('התמונה הועלתה בהצלחה!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('אירעה שגיאה בהעלאת התמונה');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      // שמירת השינויים באמצעות ה-API החדש
      const response = await fetch('/api/homepage/images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageImages)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בשמירת השינויים');
      }

      setSuccessMessage('השינויים נשמרו בהצלחה!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving homepage images:', err);
      setError('אירעה שגיאה בשמירת השינויים');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <h3 className="text-blue-700 font-medium mb-2">הנחיות:</h3>
        <ul className="list-disc list-inside text-blue-600 text-sm space-y-1">
          <li>העלה תמונות באיכות גבוהה בגודל אחיד (מומלץ 1200x800 פיקסלים)</li>
          <li>וודא שהתמונות מייצגות את הקטגוריה שלהן בצורה ברורה</li>
          <li>התמונות יופיעו באתר מיד לאחר השמירה</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-700 mb-4">
          {successMessage}
        </div>
      )}

      {/* אזור קולקציות */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">הקולקציה שלנו</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <img 
              src={homepageImages.collections} 
              alt="תמונת קולקציה" 
              className="object-cover w-full h-60 rounded-md border border-gray-200"
            />
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">תמונה ראשית לקטגוריית הקולקציה שלנו בדף הבית.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                החלף תמונה:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'collections')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>
          </div>
        </div>
      </div>

      {/* אזור עיצוב אישי */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">צרי תכשיט המותאם רק לך</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <img 
              src={homepageImages.customDesign} 
              alt="תמונת עיצוב אישי" 
              className="object-cover w-full h-60 rounded-md border border-gray-200"
            />
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">תמונה ראשית לאזור העיצוב האישי בדף הבית.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                החלף תמונה:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'customDesign')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>
          </div>
        </div>
      </div>

      {/* אזור קטגוריות */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">תמונות קטגוריות</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(homepageImages.categories).map(([category, imageUrl]) => (
            <div key={category} className="border border-gray-200 rounded-md p-4">
              <h3 className="font-medium mb-3">
                {category === 'necklaces' && 'שרשראות'}
                {category === 'bracelets' && 'צמידים'}
                {category === 'faceMasks' && 'מסכות פנים'} 
                {category === 'phoneStickers' && 'מדבקות לטלפון'}
              </h3>
              
              <img 
                src={imageUrl} 
                alt={`תמונת ${category}`} 
                className="object-cover w-full h-40 rounded-md border border-gray-200 mb-3"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  החלף תמונה:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'categories', category)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                    file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'שומר שינויים...' : 'שמור שינויים'}
        </button>
      </div>
    </div>
  );
}

// קומפוננטת ניהול תמונות עיצוב אישי
function CustomDesignImagesManager() {
  const [designImages, setDesignImages] = useState({
    baseTypes: {
      necklace: '/images/placeholders/jewelry-placeholder.jpg',
      bracelet: '/images/placeholders/jewelry-placeholder.jpg'
    },
    braceletModels: {
      1: '/images/placeholders/jewelry-placeholder.jpg',
      2: '/images/placeholders/jewelry-placeholder.jpg'
    },
    necklaceModels: {
      5: '/images/placeholders/jewelry-placeholder.jpg',
      6: '/images/placeholders/jewelry-placeholder.jpg'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/custom-design/images');
      if (response.ok) {
        const data = await response.json();
        setDesignImages(data);
        setError(null);
      } else {
        const errData = await response.json();
        throw new Error(errData.error || 'שגיאה בטעינת תמונות');
      }
    } catch (err) {
      console.error('Error fetching custom design images:', err);
      setError('שגיאה בטעינת תמונות עיצוב אישי');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event, sectionKey, itemKey) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || 'שגיאה בהעלאת קובץ');
      }

      const { imageUrl } = await uploadRes.json();

      setDesignImages(prev => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          [itemKey]: imageUrl
        }
      }));

      setSuccessMessage('התמונה הועלתה בהצלחה!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('שגיאה בהעלאת התמונה');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/custom-design/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designImages)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'שגיאה בשמירה');
      }
      setSuccessMessage('השינויים נשמרו בהצלחה!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving images:', err);
      setError('שגיאה בשמירת התמונות');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-700">{successMessage}</div>
      )}

      {/* בסיס: שרשרת / צמיד */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">תמונות בסיס</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(designImages.baseTypes).map(([key, url]) => (
            <div key={key} className="space-y-3">
              <h3 className="font-medium">
                {key === 'necklace' ? 'שרשרת' : 'צמיד'}
              </h3>
              <img src={url} alt={key} className="w-full h-48 object-cover rounded-md border" />
              <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e, 'baseTypes', key)} />
            </div>
          ))}
        </div>
      </div>

      {/* דגמי צמיד */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">דגמי צמיד</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(designImages.braceletModels).map(([id, url]) => (
            <div key={id} className="space-y-3">
              <h3 className="font-medium">{id === '1' ? 'צמיד רגיל' : 'צמיד חרוזים'}</h3>
              <img src={url} alt={id} className="w-full h-48 object-cover rounded-md border" />
              <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e, 'braceletModels', id)} />
            </div>
          ))}
        </div>
      </div>

      {/* דגמי שרשרת */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">דגמי שרשרת</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(designImages.necklaceModels).map(([id, url]) => (
            <div key={id} className="space-y-3">
              <h3 className="font-medium">{id === '5' ? 'שרשרת רגילה' : 'שרשרת חרוזים'}</h3>
              <img src={url} alt={id} className="w-full h-48 object-cover rounded-md border" />
              <input type="file" accept="image/*" onChange={(e)=>handleImageUpload(e, 'necklaceModels', id)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={loading} className="bg-primary text-white py-2 px-6 rounded-md disabled:opacity-50">
          {loading ? 'שומר...' : 'שמור שינויים'}
        </button>
      </div>
    </div>
  );
}