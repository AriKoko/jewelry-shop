"use client"

import { useState } from 'react'
import { paymentOptions } from '../../lib/products'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'שאלה על מוצר',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: false });
    
    // שמירת הנתונים בלוקל סטורג' עד שיהיה API אמיתי
    try {
      const timestamp = new Date().toISOString();
      const messageId = `msg_${Date.now()}`;
      
      const messageData = {
        _id: messageId,
        ...formData,
        createdAt: timestamp,
        status: 'new'
      };
      
      // שליפת ההודעות הקיימות מהלוקל סטורג'
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      
      // הוספת ההודעה החדשה
      existingMessages.push(messageData);
      
      // שמירה חזרה ללוקל סטורג'
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
      
      // עדכון הסטטוס בצד הלקוח
      console.log('Message saved to localStorage:', messageData);
      setFormStatus({ submitting: false, success: true, error: false });
      
      // איפוס הטופס אחרי ההצלחה
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'שאלה על מוצר',
        message: '',
      });
      
      // איפוס הודעת ההצלחה אחרי 5 שניות
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (error) {
      console.error('Error saving message:', error);
      setFormStatus({ submitting: false, success: false, error: true });
    }
  };
  
  const contactInfo = {
    phoneNumber: '0587455735',
    email: 'avivgoldboim@gmail.com',
    instagram: 'aviv5078',
    address: 'האלה 14, טל אל',
  };
  
  return (
    <div className="container-custom py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold mb-2">צרי איתנו קשר</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          יש לך שאלה או בקשה מיוחדת? נשמח לעזור לך בכל נושא
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* טופס יצירת קשר */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
          <h2 className="text-2xl font-medium mb-6">שלחי לנו הודעה</h2>
          
          {formStatus.success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              <p className="font-medium">תודה על פנייתך!</p>
              <p className="text-sm">ההודעה התקבלה בהצלחה, ניצור איתך קשר בהקדם.</p>
            </div>
          )}
          
          {formStatus.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
              <p className="font-medium">שגיאה בשליחת הטופס</p>
              <p className="text-sm">אנא נסי שנית או צרי קשר באמצעי אחר.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">שם מלא</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">טלפון</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">אימייל</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">נושא הפנייה</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="שאלה על מוצר">שאלה על מוצר</option>
                <option value="מידע על הזמנה">מידע על הזמנה</option>
                <option value="עיצוב מותאם אישית">עיצוב מותאם אישית</option>
                <option value="פנייה אחרת">פנייה אחרת</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">תוכן ההודעה</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={formStatus.submitting}
                className="btn-primary w-full py-3 transition-all"
              >
                {formStatus.submitting ? 'שולח...' : 'שליחת הודעה'}
              </button>
            </div>
          </form>
        </div>
        
        {/* פרטי התקשרות */}
        <div className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl font-medium mb-6">פרטי התקשרות</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm ml-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">טלפון</p>
                  <p className="text-gray-600 mt-1">{contactInfo.phoneNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm ml-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">אימייל</p>
                  <p className="text-gray-600 mt-1">{contactInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm ml-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">כתובת</p>
                  <p className="text-gray-600 mt-1">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm ml-3">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">אינסטגרם</p>
                  <a 
                    href={`https://instagram.com/${contactInfo.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline mt-1 block"
                  >
                    @{contactInfo.instagram}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/5 rounded-lg p-6 lg:p-8">
            <h2 className="text-xl font-medium mb-4">אפשרויות תשלום</h2>
            <div className="space-y-3">
              {paymentOptions.map(option => (
                <div key={option.id} className="flex items-center">
                  <svg className="h-5 w-5 text-secondary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <span className="font-medium">{option.name}</span>
                    {option.phoneNumber && <span className="text-gray-600 mr-2">({option.phoneNumber})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 lg:p-8">
            <h2 className="text-xl font-medium text-yellow-800 mb-4">לתשומת לבך</h2>
            <p className="text-yellow-700">
              כל המוצרים שלנו מגיעים לאיסוף עצמי בלבד. לאחר ביצוע ההזמנה נשלח לך הודעה עם פרטי האיסוף.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 