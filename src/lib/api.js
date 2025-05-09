// פונקציות עזר לביצוע קריאות API

// מוצרים
export async function fetchProducts(category = null, featured = null) {
  let url = '/api/products';
  const params = new URLSearchParams();
  
  if (category) {
    params.append('category', category);
  }
  
  if (featured) {
    params.append('featured', 'true');
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת המוצרים');
  }
  
  return data.products;
}

export async function fetchProductById(id) {
  const response = await fetch(`/api/products/${id}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת המוצר');
  }
  
  return data.product;
}

export async function createProduct(productData) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה ביצירת המוצר');
  }
  
  return data.product;
}

export async function updateProduct(id, productData) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בעדכון המוצר');
  }
  
  return data.product;
}

export async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה במחיקת המוצר');
  }
  
  return true;
}

// פריטים מותאמים אישית
export async function fetchCustomItems(type = null, featured = null) {
  let url = '/api/customItems';
  const params = new URLSearchParams();
  
  if (type) {
    params.append('type', type);
  }
  
  if (featured) {
    params.append('featured', 'true');
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת הפריטים המותאמים אישית');
  }
  
  return data.customItems;
}

export async function fetchCustomItemById(id) {
  const response = await fetch(`/api/customItems/${id}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת הפריט המותאם אישית');
  }
  
  return data.customItem;
}

export async function createCustomItem(customItemData) {
  const response = await fetch('/api/customItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customItemData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה ביצירת הפריט המותאם אישית');
  }
  
  return data.customItem;
}

export async function updateCustomItem(id, customItemData) {
  const response = await fetch(`/api/customItems/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customItemData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בעדכון הפריט המותאם אישית');
  }
  
  return data.customItem;
}

export async function deleteCustomItem(id) {
  const response = await fetch(`/api/customItems/${id}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה במחיקת הפריט המותאם אישית');
  }
  
  return true;
}

// הזמנות
export async function fetchOrders(status = null) {
  try {
    let url = '/api/orders';
    
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בטעינת הזמנות');
    }
    
    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function fetchOrderById(id) {
  const response = await fetch(`/api/orders/${id}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת ההזמנה');
  }
  
  return data.order;
}

export async function createOrder(orderData) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה ביצירת ההזמנה');
  }
  
  return data.order;
}

export async function updateOrder(orderId, updateData) {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון הזמנה');
    }
    
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function deleteOrder(id) {
  const response = await fetch(`/api/orders/${id}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה במחיקת ההזמנה');
  }
  
  return true;
}

// פונקציות API לניהול תליונים
export async function getCharms(options = {}) {
  const { category, active } = options;
  
  let url = '/api/charms';
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (active !== undefined) params.append('active', active);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const res = await fetch(url);
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת התליונים');
  }
  
  return data.charms;
}

export async function getCharm(id) {
  const res = await fetch(`/api/charms/${id}`);
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בטעינת התליון');
  }
  
  return data.charm;
}

export async function createCharm(charmData) {
  const res = await fetch('/api/charms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(charmData),
  });
  
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה ביצירת התליון');
  }
  
  return data.charm;
}

export async function updateCharm(id, charmData) {
  const res = await fetch(`/api/charms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(charmData),
  });
  
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה בעדכון התליון');
  }
  
  return data.charm;
}

export async function deleteCharm(id) {
  const res = await fetch(`/api/charms/${id}`, {
    method: 'DELETE',
  });
  
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.message || 'אירעה שגיאה במחיקת התליון');
  }
  
  return true;
}

// העלאת תמונות
export async function uploadImage(formData) {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'אירעה שגיאה בהעלאת התמונה');
    }
    
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// מחיקת תמונה
export async function deleteImage(imagePath) {
  try {
    const response = await fetch(`/api/upload?path=${encodeURIComponent(imagePath)}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'אירעה שגיאה במחיקת התמונה');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// קופונים
export async function fetchCoupons(isActive = null) {
  try {
    let url = '/api/coupons';
    
    if (isActive !== null) {
      url += `?isActive=${isActive}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בטעינת קופונים');
    }
    
    const data = await response.json();
    return data.coupons;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
}

export async function fetchCouponByCode(code) {
  try {
    const response = await fetch(`/api/coupons/code/${code}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בטעינת קופון');
    }
    
    const data = await response.json();
    return data.coupon;
  } catch (error) {
    console.error('Error fetching coupon by code:', error);
    throw error;
  }
}

export async function validateCoupon(code, cartTotal, productIds = [], categories = []) {
  try {
    const response = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        cartTotal,
        productIds,
        categories
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        valid: false,
        message: errorData.message || 'קופון לא תקין'
      };
    }
    
    const data = await response.json();
    return {
      valid: true,
      coupon: data.coupon,
      discount: data.discount,
      message: data.message
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      message: 'אירעה שגיאה בבדיקת הקופון'
    };
  }
}

export async function createCoupon(couponData) {
  try {
    const response = await fetch('/api/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(couponData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה ביצירת קופון');
    }
    
    const data = await response.json();
    return data.coupon;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
}

export async function updateCoupon(id, couponData) {
  try {
    const response = await fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(couponData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון קופון');
    }
    
    const data = await response.json();
    return data.coupon;
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw error;
  }
}

export async function deleteCoupon(id) {
  try {
    const response = await fetch(`/api/coupons/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה במחיקת קופון');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
}

export async function updateCouponUsage(code) {
  try {
    const response = await fetch('/api/coupons/use', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון שימוש בקופון');
    }
    
    const data = await response.json();
    return data.coupon;
  } catch (error) {
    console.error('Error updating coupon usage:', error);
    throw error;
  }
}

// פונקציות API לניהול תמונות דף הבית
export const getHomepageImages = async () => {
  try {
    const response = await fetch('/api/homepage/images', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בטעינת תמונות דף הבית');
    }
    
    return await response.json();
  } catch (error) {
    console.error('שגיאה בטעינת תמונות דף הבית:', error);
    throw error;
  }
};

export const updateHomepageImages = async (imagesData) => {
  try {
    const response = await fetch('/api/homepage/images', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imagesData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'שגיאה בעדכון תמונות דף הבית');
    }
    
    return await response.json();
  } catch (error) {
    console.error('שגיאה בעדכון תמונות דף הבית:', error);
    throw error;
  }
}; 