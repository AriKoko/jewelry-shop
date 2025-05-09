import mongoose from 'mongoose';

// סכמה עבור פריט בודד בהזמנה
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
    default: '000000000000000000000000' // ID ברירת מחדל למוצרים מותאמים אישית
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: false
  },
  // פרטי התאמה אישית בפורמט חופשי
  customization: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  // פרטי התאמה אישית מובנים
  customDetails: {
    baseType: {
      type: String, // 'necklace', 'bracelet', etc.
      required: false
    },
    modelName: {
      type: String,
      required: false
    },
    type: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name
      required: false
    },
    material: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name
      required: false
    },
    length: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם lengthValue ו-unit
      required: false
    },
    width: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם widthValue ו-unit
      required: false
    },
    color: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name/hex
      required: false
    },
    style: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name
      required: false
    },
    pattern: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name
      required: false
    },
    clasp: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name
      required: false
    },
    selectedCharms: {
      type: [{
        name: String,
        image: String,
        price: Number
      }],
      default: []
    },
    gemstones: {
      type: [{
        name: String,
        color: mongoose.Schema.Types.Mixed,
        size: String,
        price: Number
      }],
      default: []
    },
    size: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    },
    font: {
      type: mongoose.Schema.Types.Mixed, // string או אובייקט עם name
      required: false
    },
    notes: {
      type: String,
      required: false
    }
  },
  // אופציות התאמה אישית (מבנה ישן)
  customOptions: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
});

// סכמה עבור פרטי משלוח
const ShippingDetailsSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: false
  },
  postalCode: {
    type: String,
    required: false
  }
});

// סכמה עבור הזמנה
const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: (items) => items.length > 0,
      message: 'הזמנה חייבת לכלול לפחות פריט אחד'
    }
  },
  total: {
    type: Number,
    required: true
  },
  shippingDetails: {
    type: ShippingDetailsSchema,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

// יצירת מודל אם הוא לא קיים כבר
export default mongoose.models.Order || mongoose.model('Order', OrderSchema); 