// קובץ נתונים זמני עד להתחברות ל-API אמיתי

// מוצרים לקולקציה
export const products = [
  {
    id: '1',
    name: 'שרשרת כחולה',
    price: 10,
    discountPrice: 10,
    description: 'שרשרת כחולה איכותית בעבודת יד',
    material: 'כסף ואבני חן',
    category: 'necklaces',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['שרשראות', 'כחול', 'אבני חן'],
    featured: true,
    colors: ['#3b82f6', '#1e40af']
  },
  {
    id: '2',
    name: 'שרשרת פנינים',
    price: 10,
    description: 'שרשרת פנינים קלאסית',
    material: 'פנינים',
    category: 'necklaces',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['שרשראות', 'פנינים'],
    featured: true,
    colors: ['#f5f5f4', '#e7e5e4']
  },
  {
    id: '3',
    name: 'שרשרת פלפל חריף',
    price: 10,
    description: 'שרשרת עם תליון פלפל חריף צבעוני',
    material: 'כסף וזכוכית',
    category: 'necklaces',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['שרשראות', 'פלפל חריף', 'צבעוני'],
    featured: true,
    colors: ['#ef4444', '#dc2626']
  },
  {
    id: '4',
    name: 'שרשרת כוכב ים',
    price: 10,
    description: 'שרשרת עם תליון כוכב ים',
    material: 'כסף',
    category: 'necklaces',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['שרשראות', 'כוכב ים', 'ים'],
    colors: ['#0ea5e9', '#7dd3fc']
  },
  {
    id: '5',
    name: 'צמיד סטיץ',
    price: 5,
    description: 'צמיד חמוד בעיצוב דמות סטיץ',
    material: 'סיליקון',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'סטיץ', 'דיסני'],
    colors: ['#22c55e', '#4ade80']
  },
  {
    id: '6',
    name: 'צמיד חמסה',
    price: 5,
    description: 'צמיד עם תליון חמסה להגנה ומזל',
    material: 'כסף',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'חמסה', 'מזל'],
    colors: ['#a1a1aa', '#d4d4d8']
  },
  {
    id: '7',
    name: 'צמיד צב ים',
    price: 5,
    description: 'צמיד עם תליון צב ים',
    material: 'כסף וזכוכית',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'צב ים', 'ים'],
    colors: ['#22c55e', '#16a34a']
  },
  {
    id: '8',
    name: 'צמיד ים',
    price: 5,
    description: 'צמיד בעיצוב ימי עם תליוני צדפים וכוכבי ים',
    material: 'כסף וזכוכית',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'ים', 'צדפים', 'כוכבי ים'],
    colors: ['#0ea5e9', '#0284c7']
  },
  {
    id: '9',
    name: 'צמיד שקוף',
    price: 5,
    description: 'צמיד שקוף עם חרוזים צבעוניים',
    material: 'פלסטיק ואבני זכוכית',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'שקוף', 'חרוזים'],
    featured: true,
    colors: ['#f5f5f4', '#f43f5e', '#0ea5e9']
  },
  {
    id: '10',
    name: 'צמיד חמסות',
    price: 5,
    description: 'צמיד עם מספר תליוני חמסה',
    material: 'כסף',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'חמסות', 'מזל'],
    featured: true,
    colors: ['#a1a1aa', '#e5e5e5']
  },
  {
    id: '11',
    name: 'צמיד חרוזים',
    price: 5,
    description: 'צמיד חרוזים צבעוני',
    material: 'חרוזי זכוכית',
    category: 'bracelets',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['צמידים', 'חרוזים', 'צבעוני'],
    colors: ['#f43f5e', '#0ea5e9', '#eab308']
  },
  {
    id: '12',
    name: 'מסכת פנים מתנפחת במים',
    price: 2,
    description: 'מסכת פנים חדשנית המתנפחת במגע עם מים',
    material: 'בד מיוחד',
    category: 'face_masks',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['מסכות פנים', 'טיפוח', 'מתנפחת'],
    featured: true,
    colors: ['#a3e635', '#65a30d']
  },
  {
    id: '13',
    name: 'מדבקה לטלפון - שחורה',
    price: 5,
    description: 'מדבקה אחורית לטלפון בצבע שחור קלאסי',
    material: 'ויניל איכותי',
    category: 'phone_stickers',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['מדבקות', 'טלפון', 'שחור'],
    featured: true,
    colors: ['#18181b', '#27272a']
  },
  {
    id: '14',
    name: 'מדבקה לטלפון - לבנה',
    price: 5,
    description: 'מדבקה אחורית לטלפון בצבע לבן נקי',
    material: 'ויניל איכותי',
    category: 'phone_stickers',
    image: '/images/placeholders/jewelry-placeholder.jpg',
    tags: ['מדבקות', 'טלפון', 'לבן'],
    featured: true,
    colors: ['#f8fafc', '#f1f5f9']
  }
];

// קטגוריות המוצרים
export const categories = [
  { id: "necklaces", name: "שרשראות", image: "/images/placeholders/jewelry-placeholder.jpg" },
  { id: "bracelets", name: "צמידים", image: "/images/placeholders/jewelry-placeholder.jpg" },
  { id: "face_masks", name: "מסכות פנים", image: "/images/placeholders/jewelry-placeholder.jpg" },
  { id: "phone_stickers", name: "מדבקות אחוריות לטלפון", image: "/images/placeholders/jewelry-placeholder.jpg" },
];

// חומרים לבחירה
export const materials = [
  { id: 'silver', name: 'כסף 925', price: 20 },
  { id: 'gold', name: 'ציפוי זהב', price: 35 },
  { id: 'rose_gold', name: 'ציפוי זהב אדום', price: 35 },
];

// בסיס למוצר בעיצוב אישי
export const customBaseTypes = [
  { id: 'necklace', name: 'שרשרת', price: 10, image: '/no-image.svg' },
  { id: 'bracelet', name: 'צמיד', price: 5, image: '/no-image.svg' },
];

// השראות (קטגוריה חדשה)
export const inspirations = [
  { id: 'insp1', name: 'השראה 1', price: 10, image: '/no-image.svg' },
  { id: 'insp2', name: 'השראה 2', price: 10, image: '/no-image.svg' },
  { id: 'insp3', name: 'השראה 3', price: 10, image: '/no-image.svg' },
];

// תליונים
export const charms = [
  { id: 'white_bow_bead', name: 'פפיון לבן (חרוז)', image: '/no-image.svg' },
  { id: 'butterfly', name: 'פרפר', image: '/no-image.svg' },
  { id: 'moon_heart', name: 'ירח לב', image: '/no-image.svg' },
  { id: 'star_in_star', name: 'כוכב בתוך כוכב', image: '/no-image.svg' },
  { id: 'hamsa', name: 'חמסה', image: '/no-image.svg' },
  { id: 'starfish', name: 'כוכב ים', image: '/no-image.svg' },
  { id: 'flower', name: 'פרח', image: '/no-image.svg' },
  { id: 'key', name: 'מפתח', image: '/no-image.svg' },
  { id: 'feather', name: 'נוצה', image: '/no-image.svg' },
  { id: 'shell', name: 'צדפה', image: '/no-image.svg' },
  { id: 'hot_pepper', name: 'פלפל חריף', image: '/no-image.svg' },
  { id: 'blue_starfish', name: 'כוכב ים כחול', image: '/no-image.svg' },
  { id: 'white_starfish', name: 'כוכב ים לבן', image: '/no-image.svg' },
  { id: 'white_bow', name: 'פפיון לבן', image: '/no-image.svg' },
  { id: 'pink_bow', name: 'פפיון ורוד', image: '/no-image.svg' },
  { id: 'sea_turtle', name: 'צב ים', image: '/no-image.svg' },
  { id: 'green_sea_turtle', name: 'צב ים ירוק', image: '/no-image.svg' },
  { id: 'zodiac', name: 'מזלות', image: '/no-image.svg' },
  { id: 'heart_bead', name: 'לב (חרוז)', image: '/no-image.svg' },
  { id: 'shell_with_pearl', name: 'צדפה עם פנינה', image: '/no-image.svg' },
  { id: 'teddy_bead', name: 'דובי (חרוז)', image: '/no-image.svg' },
  { id: 'bow', name: 'פפיון', image: '/no-image.svg' },
  { id: 'swan_heart', name: 'לב ברבורים', image: '/no-image.svg' },
  { id: 'heart', name: 'לב', image: '/no-image.svg' },
  { id: 'fish', name: 'דג', image: '/no-image.svg' },
  { id: 'heart_with_arrow', name: 'לב עם חץ', image: '/no-image.svg' },
  { id: 'clover', name: 'תילתן', image: '/no-image.svg' },
  { id: 'leaf', name: 'עלה', image: '/no-image.svg' },
  { id: 'earth_heart', name: 'כדור הארץ לב', image: '/no-image.svg' },
  { id: 'heart_coral', name: 'ליבתן', image: '/no-image.svg' },
  { id: 'mermaid', name: 'בת ים', image: '/no-image.svg' },
  { id: 'sun', name: 'שמש', image: '/no-image.svg' },
  { id: 'heart_in_heart', name: 'לב בתוך לב', image: '/no-image.svg' },
  { id: 'dolphins', name: 'דולפינים', image: '/no-image.svg' },
  { id: 'star_of_david', name: 'מגן דוד', image: '/no-image.svg' },
  { id: 'fin', name: 'סנפיר', image: '/no-image.svg' },
  { id: 'a_jeweled', name: 'A משובץ', image: '/no-image.svg' },
  { id: 'abc', name: 'ABC', image: '/no-image.svg' },
  { id: 'dollar', name: 'דולר', image: '/no-image.svg' },
  { id: 'rainbow', name: 'קשת בענן', image: '/no-image.svg' },
  { id: 'bows', name: 'פפיונים', image: '/no-image.svg' },
  { id: 'beads', name: 'חרוזים', image: '/no-image.svg' },
  { id: 'balloon_dog', name: 'בלון כלב', image: '/no-image.svg' },
  { id: 'star', name: 'כוכב', image: '/no-image.svg' },
  { id: 'sea', name: 'ים', image: '/no-image.svg' },
  { id: 'gummy_bears', name: 'דובוני גומי', image: '/no-image.svg' },
  { id: 'patrick', name: 'פטריק', image: '/no-image.svg' },
  { id: 'spongebob', name: 'בובספוג', image: '/no-image.svg' },
  { id: 'mr_krabs', name: 'מר קרב', image: '/no-image.svg' },
  { id: 'squidward', name: 'סקווידויד', image: '/no-image.svg' },
  { id: 'gary', name: 'גרי', image: '/no-image.svg' },
  { id: 'candies', name: 'סוכריות', image: '/no-image.svg' },
  { id: 'stitch', name: 'סטיץ', image: '/no-image.svg' },
  { id: 'stitch_crying', name: 'סטיץ בוכה', image: '/no-image.svg' },
  { id: 'stitch_confused', name: 'סטיץ מובך', image: '/no-image.svg' },
  { id: 'stitch_happy', name: 'סטיץ שמח', image: '/no-image.svg' },
  { id: 'candy_bead', name: 'סוכריה (חרוז)', image: '/no-image.svg' },
  { id: 'star_bead', name: 'כוכב (חרוז)', image: '/no-image.svg' },
  { id: 'rapunzel', name: 'רפונזל', image: '/no-image.svg' },
  { id: 'princess', name: 'נסיכה', image: '/no-image.svg' },
  { id: 'snow_white', name: 'שלגיה', image: '/no-image.svg' },
  { id: 'cinderella', name: 'סנדרלה', image: '/no-image.svg' },
  { id: 'my_little_pony', name: 'סוס פוני', image: '/no-image.svg' },
  { id: 'little_mermaid', name: 'בת הים הקטנה', image: '/no-image.svg' },
  { id: 'colorful_beads', name: 'חרוזים צבעונים', image: '/no-image.svg' },
];

// אפשרויות תשלום
export const paymentOptions = [
  { id: 'bit', name: 'ביט', phoneNumber: '0587455735' },
  { id: 'paybox', name: 'פייבוקס', phoneNumber: '0587455735' },
  { id: 'cash', name: 'מזומן בעת האיסוף' },
];

// פונקציה להחזרת כל המוצרים
export function getAllProducts() {
  try {
    console.log("getAllProducts נקרא, products:", Array.isArray(products) ? products.length : products);
    if (!Array.isArray(products)) {
      console.error("מערך המוצרים אינו מוגדר כראוי", products);
      return [];
    }
    return products;
  } catch (err) {
    console.error("שגיאה בקבלת כל המוצרים:", err);
    return [];
  }
}

// פונקציה להחזרת מוצר לפי מזהה
export function getProductById(id) {
  try {
    if (!Array.isArray(products)) {
      console.error("מערך המוצרים אינו מוגדר כראוי בעת חיפוש לפי מזהה");
      return null;
    }
    return products.find(product => product.id === id);
  } catch (err) {
    console.error(`שגיאה בחיפוש מוצר לפי מזהה ${id}:`, err);
    return null;
  }
}

// פונקציה להחזרת המוצרים המובחרים
export function getFeaturedProducts() {
  try {
    if (!Array.isArray(products)) {
      console.error("מערך המוצרים אינו מוגדר כראוי בעת חיפוש מוצרים מומלצים");
      return [];
    }
    return products.filter(product => product.featured);
  } catch (err) {
    console.error("שגיאה בקבלת מוצרים מומלצים:", err);
    return [];
  }
}

// פונקציה לחיפוש מוצרים
export function searchProducts(query) {
  try {
    if (!Array.isArray(products)) {
      console.error("מערך המוצרים אינו מוגדר כראוי בעת חיפוש מוצרים");
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  } catch (err) {
    console.error(`שגיאה בחיפוש מוצרים עם המונח "${query}":`, err);
    return [];
  }
}

// פונקציה להחזרת מוצרים לפי קטגוריה
export function getProductsByCategory(categoryId) {
  try {
    console.log(`getProductsByCategory נקרא עם categoryId:`, categoryId);
    
    if (!Array.isArray(products)) {
      console.error("מערך המוצרים אינו מוגדר כראוי בעת חיפוש לפי קטגוריה");
      return [];
    }
    
    if (!categoryId) {
      console.warn("מזהה קטגוריה חסר, מחזיר מערך ריק");
      return [];
    }
    
    const result = products.filter(product => product.category === categoryId);
    console.log(`נמצאו ${result.length} מוצרים בקטגוריה ${categoryId}`);
    return result;
  } catch (err) {
    console.error(`שגיאה בקבלת מוצרים לפי קטגוריה ${categoryId}:`, err);
    return [];
  }
} 