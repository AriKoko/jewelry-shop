import mongoose from 'mongoose';

const CharmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'נא להזין שם תליון'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'נא להוסיף תמונה'],
    default: '/images/placeholders/jewelry-placeholder.jpg'
  },
  price: {
    type: Number,
    required: [true, 'נא להזין מחיר'],
    min: [0, 'המחיר חייב להיות מספר חיובי'],
    default: 0
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false,
    default: 'general'
  },
  material: {
    type: String,
    required: false
  },
  stock: {
    type: Number,
    required: [true, 'נא להזין כמות במלאי'],
    min: [0, 'המלאי חייב להיות מספר חיובי'],
    default: 10
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Charm || mongoose.model('Charm', CharmSchema); 