"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { materials, charms, paymentOptions, customBaseTypes } from '../lib/products'
import { getCharms } from '../lib/api'
import Toast from './Toast'
import { useCart } from '../contexts/CartContext'

const CustomDesignTool = () => {
  const { addToCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBaseType, setSelectedBaseType] = useState('') // שרשרת או צמיד
  const [braceletType, setBraceletType] = useState('')
  const [selectedCharms, setSelectedCharms] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [slideDirection, setSlideDirection] = useState('next')
  const [showAllCharms, setShowAllCharms] = useState(false) // האם להציג את כל התליונים או רק 8 הראשונים
  const [charmOptions, setCharmOptions] = useState([])
  const [isLoadingCharms, setIsLoadingCharms] = useState(true)
  const [designImages, setDesignImages] = useState(null)
  
  // טעינת התליונים מה-API בעת טעינת הקומפוננטה
  useEffect(() => {
    const fetchCharms = async () => {
      try {
        setIsLoadingCharms(true);
        // נטען רק תליונים פעילים
        const fetchedCharms = await getCharms({ active: true });
        
        // ממיר את התליונים לפורמט שהקומפוננטה משתמשת בו
        const formattedCharms = fetchedCharms.map((charm, index) => ({
          id: charm._id,
          name: charm.name,
          price: charm.price || 19.99,
          image: charm.image || '/images/placeholders/jewelry-placeholder.jpg',
          isGlitter: index % 4 === 0,  // הוספת אפקט נצנוץ לחלק מהתליונים
        }));
        
        setCharmOptions(formattedCharms);
      } catch (error) {
        console.error('שגיאה בטעינת התליונים:', error);
        setToastMessage('אירעה שגיאה בטעינת התליונים');
        setToastType('error');
        setShowToast(true);
        // במקרה של שגיאה, נשתמש בתליונים ריקים
        setCharmOptions([]);
      } finally {
        setIsLoadingCharms(false);
      }
    };
    
    fetchCharms();
  }, []);
  
  // טעינת תמונות הבסיס והדגמים
  useEffect(() => {
    const fetchDesignImages = async () => {
      try {
        const res = await fetch('/api/custom-design/images')
        if (res.ok) {
          const data = await res.json()
          setDesignImages(data)
        }
      } catch (err) {
        console.error('שגיאה בטעינת תמונות עיצוב אישי:', err)
      }
    }
    fetchDesignImages()
  }, [])
  
  // סוגי תכשיטים לעיצוב
  const jewelryTypes = [
    { id: 'necklace', name: 'שרשרת', basePrice: 50, image: '/images/placeholders/jewelry-placeholder.jpg' },
    { id: 'bracelet', name: 'צמיד', basePrice: 40, image: '/images/placeholders/jewelry-placeholder.jpg' },
    { id: 'earrings', name: 'עגילים', basePrice: 35, image: '/images/placeholders/jewelry-placeholder.jpg' },
    { id: 'phone_sticker', name: 'מדבקה אחורית לטלפון', basePrice: 30, image: '/images/placeholders/jewelry-placeholder.jpg' },
  ];
  
  // אורכים אפשריים
  const lengthOptions = [
    { id: 'short', name: 'קצר', lengthValue: '40 ס"מ / 16 ס"מ', priceModifier: 0 },
    { id: 'medium', name: 'בינוני', lengthValue: '45 ס"מ / 18 ס"מ', priceModifier: 5 },
    { id: 'long', name: 'ארוך', lengthValue: '50 ס"מ / 20 ס"מ', priceModifier: 10 },
  ];
  
  // מצב העיצוב
  const [design, setDesign] = useState({
    type: jewelryTypes[0],
    material: materials[0],
    length: lengthOptions[0],
    selectedCharms: [],
    notes: '',
  });
  
  // רשימת האפשרויות לסוגי צמידים
  const braceletOptions = [
    { id: 1, name: 'צמיד רגיל', price: 10, priceModifier: 0, image: (designImages?.braceletModels?.[1]) || '/images/placeholders/jewelry-placeholder.jpg' },
    { id: 2, name: 'צמיד חרוזים', price: 15, priceModifier: 5, image: (designImages?.braceletModels?.[2]) || '/images/placeholders/jewelry-placeholder.jpg' },
  ]

  // רשימת האפשרויות לסוגי שרשראות
  const necklaceOptions = [
    { id: 5, name: 'שרשרת רגילה', price: 10, priceModifier: 0, image: (designImages?.necklaceModels?.[5]) || '/images/placeholders/jewelry-placeholder.jpg' },
    { id: 6, name: 'שרשרת חרוזים', price: 15, priceModifier: 5, image: (designImages?.necklaceModels?.[6]) || '/images/placeholders/jewelry-placeholder.jpg' },
  ]
  
  // מצב הצגת התליונים - רק 8 הראשונים או כולם
  const displayedCharms = showAllCharms ? charmOptions : charmOptions.slice(0, 8)
  
  // חישוב המחיר הכולל
  const calculateTotalPrice = () => {
    // מחיר הבסיס בהתאם לסוג המוצר שנבחר
    let basePrice = 0
    let additionalPrice = 0
    
    if (selectedBaseType === 'necklace') {
      const selectedOption = necklaceOptions.find(option => option.id === braceletType);
      basePrice = selectedOption?.price || 0;
      additionalPrice = selectedOption?.priceModifier || 0;
    } else if (selectedBaseType === 'bracelet') {
      const selectedOption = braceletOptions.find(option => option.id === braceletType);
      basePrice = selectedOption?.price || 0;
      additionalPrice = selectedOption?.priceModifier || 0;
    }
    
    // מספר התליונים שנבחרו - רק תליונים שעדיין קיימים במערכת
    const validSelectedCharms = selectedCharms
      .filter(charmId => charmOptions.find(charm => charm.id === charmId) !== undefined);
    
    const charmsCount = validSelectedCharms.length
    
    // 4 התליונים הראשונים בחינם, כל תליון נוסף עולה 5 שקלים
    let charmsPrice = 0
    if (charmsCount > 4) {
      charmsPrice = (charmsCount - 4) * 5 // רק תליונים מעבר לארבעה הראשונים עולים 5 שקלים כל אחד
    }
    
    // המחיר הסופי
    return (basePrice + additionalPrice + charmsPrice) * quantity
  }
  
  // הטיפול בבחירת תליונים
  const handleCharmSelection = (charmId) => {
    if (selectedCharms.includes(charmId)) {
      setSelectedCharms(selectedCharms.filter(id => id !== charmId))
    } else {
      // הגבלה של מקסימום 8 תליונים
      if (selectedCharms.length < 8) {
        setSelectedCharms([...selectedCharms, charmId])
      } else {
        setToastMessage('ניתן לבחור עד 8 תליונים לתכשיט')
        setToastType('info')
        setShowToast(true)
      }
    }
  }
  
  // מעבר לשלב הבא
  const goToNextStep = () => {
    setSlideDirection('next')
    setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, 50)
  }
  
  // מעבר לשלב הקודם
  const goToPrevStep = () => {
    setSlideDirection('prev')
    setTimeout(() => {
      setCurrentStep(prev => prev - 1)
    }, 50)
  }
  
  // טיפול בהוספת פריט מותאם אישית לסל הקניות
  const handleAddToCart = () => {
    if (!selectedBaseType) {
      setToastMessage('אנא בחר/י סוג תכשיט (שרשרת או צמיד)')
      setToastType('error')
      setShowToast(true)
      return
    }

    if (!braceletType) {
      setToastMessage('אנא בחר/י דגם ספציפי')
      setToastType('error')
      setShowToast(true)
      return
    }
    
    if (selectedCharms.length === 0) {
      setToastMessage('אנא בחר/י לפחות תליון אחד')
      setToastType('error')
      setShowToast(true)
      return
    }
    
    let selectedProduct = null
    let productName = ''
    
    if (selectedBaseType === 'necklace') {
      selectedProduct = necklaceOptions.find(option => option.id === braceletType)
      productName = `שרשרת מותאמת אישית - ${selectedProduct.name}`
    } else {
      selectedProduct = braceletOptions.find(option => option.id === braceletType)
      productName = `צמיד מותאם אישית - ${selectedProduct.name}`
    }
    
    // מסנן רק תליונים שעדיין קיימים במערכת
    const selectedCharmDetails = selectedCharms
      .map(charmId => charmOptions.find(charm => charm.id === charmId))
      .filter(charm => charm !== undefined); // מסיר תליונים לא תקינים
    
    const customItem = {
      id: `custom-${Date.now()}`,
      name: productName,
      price: calculateTotalPrice() / quantity,
      image: selectedProduct.image,
      quantity: quantity,
      customDetails: {
        baseType: selectedBaseType,
        modelName: selectedProduct.name,
        modelPrice: selectedProduct.price,
        selectedCharms: selectedCharmDetails,
        notes: notes
      }
    }
    
    // קריאה לפונקציה של הוספה לסל מהקונטקסט
    addToCart(customItem)
    
    // הצגת הודעת הצלחה
    setToastMessage('הפריט נוסף בהצלחה לסל הקניות')
    setToastType('success')
    setShowToast(true)
    
    // איפוס הטופס
    setCurrentStep(1)
    setSelectedBaseType('')
    setBraceletType('')
    setSelectedCharms([])
    setQuantity(1)
    setNotes('')
    setShowAllCharms(false)
  }
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value)
  }
  
  // הצגת התוכן בהתאם לשלב הנוכחי
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={`space-y-6 transition-all duration-500 transform ${
            slideDirection === 'next' ? 'translate-x-0 opacity-100' : 
            slideDirection === 'prev' ? 'translate-x-0 opacity-100' : ''
          }`}>
            <h3 className="text-xl font-medium text-gray-800">בחר/י סוג תכשיט</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {customBaseTypes.map((option) => {
                const img = option.id === 'necklace' ? (designImages?.baseTypes?.necklace) : (designImages?.baseTypes?.bracelet)
                const optWithImg = { ...option, image: img || option.image }
                return (
                  <div 
                    key={option.id}
                    className={`border rounded-lg p-5 cursor-pointer transition-all duration-300 ${
                      selectedBaseType === option.id 
                        ? 'border-accent bg-accent/10 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 hover:scale-[1.02]'
                    }`}
                    onClick={() => setSelectedBaseType(option.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative h-48 mb-3 overflow-hidden rounded-md group">
                        <Image
                          src={optWithImg.image}
                          alt={optWithImg.name}
                          fill
                          className={`object-cover transform transition-transform duration-700 ${
                            selectedBaseType === optWithImg.id ? 'scale-110' : 'group-hover:scale-105'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <h4 className="font-medium text-lg">{optWithImg.name}</h4>
                        <p className="text-accent font-semibold">₪{optWithImg.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between pt-4">
              <button 
                className="px-5 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={!selectedBaseType}
                onClick={goToNextStep}
              >
                המשך
              </button>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className={`space-y-6 transition-all duration-500 transform ${
            slideDirection === 'next' ? 'translate-x-0 opacity-100' : 
            slideDirection === 'prev' ? 'translate-x-0 opacity-100' : ''
          }`}>
            <h3 className="text-xl font-medium text-gray-800">
              {selectedBaseType === 'necklace' ? 'בחר/י סוג שרשרת' : 'בחר/י סוג צמיד'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBaseType === 'necklace' ? 
                necklaceOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                      braceletType === option.id 
                        ? 'border-accent bg-accent/10 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 hover:scale-[1.02]'
                    } ${option.isGlitter ? 'glitter-effect' : ''}`}
                    onClick={() => setBraceletType(option.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative h-48 mb-3 overflow-hidden rounded-md group">
                        <Image
                          src={option.image}
                          alt={option.name}
                          fill
                          className={`object-cover transform transition-transform duration-700 ${
                            braceletType === option.id ? 'scale-110' : 'group-hover:scale-105'
                          }`}
                        />
                        {option.isGlitter && (
                          <div className="absolute inset-0 glitter-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <h4 className="font-medium">{option.name}</h4>
                        {option.priceModifier && (
                          <p className="text-accent text-sm font-medium">+{option.priceModifier} ₪</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
                :
                braceletOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                      braceletType === option.id 
                        ? 'border-accent bg-accent/10 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 hover:scale-[1.02]'
                    } ${option.isGlitter ? 'glitter-effect' : ''}`}
                    onClick={() => setBraceletType(option.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative h-48 mb-3 overflow-hidden rounded-md group">
                        <Image
                          src={option.image}
                          alt={option.name}
                          fill
                          className={`object-cover transform transition-transform duration-700 ${
                            braceletType === option.id ? 'scale-110' : 'group-hover:scale-105'
                          }`}
                        />
                        {option.isGlitter && (
                          <div className="absolute inset-0 glitter-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <h4 className="font-medium">{option.name}</h4>
                        {option.priceModifier && (
                          <p className="text-accent text-sm font-medium">+{option.priceModifier} ₪</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="flex justify-between pt-4">
              <button 
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                onClick={goToPrevStep}
              >
                חזרה
              </button>
              <button 
                className="px-5 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={!braceletType}
                onClick={goToNextStep}
              >
                המשך
              </button>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className={`space-y-6 transition-all duration-500 transform ${
            slideDirection === 'next' ? 'translate-x-0 opacity-100' : 
            slideDirection === 'prev' ? 'translate-x-0 opacity-100' : ''
          }`}>
            <h3 className="text-xl font-medium text-gray-800">בחר/י תליונים לתכשיט שלך</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold text-center">4 תליונים ראשונים בחינם! 🎁</p>
              <p className="text-green-700 text-center text-sm mt-1">
                {selectedCharms.length < 4 ? 
                  `נותרו לך עוד ${4 - selectedCharms.length} תליונים בחינם לבחירה` : 
                  'ניצלת את כל התליונים החינמיים שלך'}
              </p>
            </div>

            {selectedCharms.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="w-full font-medium mb-2">תליונים שנבחרו:</p>
                {selectedCharms.map((charmId, index) => {
                  const charm = charmOptions.find(c => c.id === charmId)
                  return charm ? (
                    <div key={charmId} className="m-1 p-2 bg-accent/10 rounded-full flex items-center animate-fadeIn">
                      <span className="mr-1 text-sm">{charm.name}</span>
                      {index < 4 && <span className="text-xs text-green-600 mx-1 font-medium">(חינם)</span>}
                      {index >= 4 && <span className="text-xs text-accent mx-1 font-medium">(5 ₪)</span>}
                      <button 
                        onClick={() => handleCharmSelection(charmId)}
                        className="text-red-500 text-xs hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            )}
            
            {isLoadingCharms ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                <p className="mt-4 text-gray-600">טוען תליונים...</p>
              </div>
            ) : charmOptions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayedCharms.map((charm) => (
                  <div 
                    key={charm.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all duration-300 ${
                      selectedCharms.includes(charm.id) 
                        ? 'border-accent bg-accent/10 shadow-md scale-105' 
                        : 'border-gray-200 hover:border-accent/50 hover:bg-gray-50 hover:scale-[1.02]'
                    } ${charm.isGlitter ? 'glitter-effect' : ''}`}
                    onClick={() => handleCharmSelection(charm.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative h-24 mb-2 overflow-hidden rounded-md group">
                        <Image
                          src={charm.image}
                          alt={charm.name}
                          fill
                          className={`object-cover transform transition-transform duration-700 ${
                            selectedCharms.includes(charm.id) ? 'scale-110' : 'group-hover:scale-105'
                          }`}
                        />
                        {charm.isGlitter && (
                          <div className="absolute inset-0 glitter-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <h4 className="text-sm font-medium">{charm.name}</h4>
                        <p className="text-accent text-sm font-semibold">
                          {selectedCharms.indexOf(charm.id) < 4 && selectedCharms.includes(charm.id) ? (
                            <span className="text-green-600">חינם</span>
                          ) : selectedCharms.length < 4 && !selectedCharms.includes(charm.id) ? (
                            <span className="text-green-600">חינם</span>
                          ) : (
                            <span>₪5.00</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">לא נמצאו תליונים זמינים</p>
              </div>
            )}

            {!showAllCharms && charmOptions.length > 8 && (
              <div className="text-center pt-4">
                <button 
                  className="px-5 py-2 border border-accent text-accent rounded-md hover:bg-accent/5 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowAllCharms(true)}
                >
                  הצג עוד תליונים
                </button>
              </div>
            )}

            {showAllCharms && charmOptions.length > 8 && (
              <div className="text-center pt-4">
                <button 
                  className="px-5 py-2 border border-accent text-accent rounded-md hover:bg-accent/5 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowAllCharms(false)}
                >
                  הצג פחות תליונים
                </button>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button 
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                onClick={goToPrevStep}
              >
                חזרה
              </button>
              <button 
                className="px-5 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={selectedCharms.length === 0}
                onClick={goToNextStep}
              >
                המשך
              </button>
            </div>
          </div>
        )
      
      case 4:
        // מכין את רשימת התליונים עם חיפוש קיום
        const charmDetailsForSummary = selectedCharms
          .map(charmId => charmOptions.find(c => c.id === charmId))
          .filter(charm => charm !== undefined);

        return (
          <div className={`space-y-6 transition-all duration-500 transform ${
            slideDirection === 'next' ? 'translate-x-0 opacity-100' : 
            slideDirection === 'prev' ? 'translate-x-0 opacity-100' : ''
          }`}>
            <h3 className="text-xl font-medium text-gray-800">סיכום והזמנה</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <h4 className="font-medium mb-3">פרטי ההזמנה:</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">סוג תכשיט:</span>
                  <span className="font-medium">
                    {selectedBaseType === 'necklace' ? 'שרשרת' : 'צמיד'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">דגם:</span>
                  <span className="font-medium">
                    {selectedBaseType === 'necklace' 
                      ? necklaceOptions.find(option => option.id === braceletType)?.name
                      : braceletOptions.find(option => option.id === braceletType)?.name}
                  </span>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">תליונים נבחרים:</span>
                    <span className="font-medium">{charmDetailsForSummary.length}</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 mb-3 border border-green-200">
                    <p className="text-green-800 text-sm font-bold text-center">מבצע מיוחד! 4 תליונים ראשונים חינם!</p>
                  </div>
                  <ul className="text-sm space-y-1 pr-4 border-r-2 border-accent/30">
                    {charmDetailsForSummary.map((charm, index) => (
                      <li key={charm.id} className="flex justify-between animate-fadeIn">
                        <span>{charm.name}</span>
                        <span>
                          {index < 4 ? (
                            <span className="text-green-600 font-medium">חינם</span>
                          ) : (
                            <span>₪5.00</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-gray-600 mb-1">הערות מיוחדות:</label>
                  <textarea 
                    id="notes"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                    rows="3"
                    placeholder="הוסף/י הערות מיוחדות להזמנה (אופציונלי)"
                    value={notes}
                    onChange={handleNotesChange}
                  />
                </div>
                
                <div className="pt-2">
                  <label htmlFor="quantity" className="block text-gray-600 mb-1">כמות:</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-l-md hover:bg-gray-100 transition-colors duration-300"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      id="quantity"
                      min="1" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-8 border-t border-b border-gray-300 text-center focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 flex items-center justify-center rounded-r-md hover:bg-gray-100 transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span className="text-lg font-medium">סה"כ:</span>
                  <span className="text-lg font-bold text-accent animate-pulse">₪{calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button 
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                onClick={goToPrevStep}
              >
                חזרה
              </button>
              <button 
                className="px-5 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-all duration-300 transform hover:scale-105"
                onClick={handleAddToCart}
              >
                הוסף לסל
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto my-8">
      <style jsx global>{`
        @keyframes glitter {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .glitter-effect:hover {
          position: relative;
          overflow: hidden;
        }
        
        .glitter-overlay {
          background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 200%;
          animation: glitter 2s ease infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      
      <h2 className="text-2xl font-bold text-center mb-6">עיצוב תכשיט מותאם אישית</h2>
      
      {/* מבצע מיוחד - 4 תליונים חינם */}
      <div className="bg-accent/10 border border-accent rounded-lg p-3 mb-6 text-center animate-fadeIn">
        <div className="text-lg font-bold text-accent">מבצע מיוחד!</div>
        <div className="text-md">4 התליונים הראשונים <span className="font-bold">בחינם</span> * כל תליון נוסף רק 5 ₪</div>
      </div>
      
      {/* שלבי התהליך */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step}
            className="flex flex-col items-center w-1/4"
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-500 ${
                currentStep === step 
                  ? 'bg-accent text-white scale-110 shadow-md' 
                  : currentStep > step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > step ? '✓' : step}
            </div>
            <div className="text-center text-sm">
              {step === 1 && 'סוג תכשיט'}
              {step === 2 && 'בחירת דגם'}
              {step === 3 && 'בחירת תליונים'}
              {step === 4 && 'סיכום'}
            </div>
          </div>
        ))}
      </div>
      
      {/* תוכן השלב הנוכחי */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
      
      {/* רכיב Toast להודעות */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  )
}

export default CustomDesignTool 