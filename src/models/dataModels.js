// src/models/dataModels.js

// Clothing item model
export const CLOTHING_CATEGORIES = [
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Shoes',
    'Accessories',
    'Other'
  ];
  
  export const CLOTHING_COLORS = [
    'Black',
    'White',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Pink',
    'Purple',
    'Orange',
    'Brown',
    'Multi'
  ];
  
  export const CLOTHING_OCCASIONS = [
    'Casual',
    'Formal',
    'Work',
    'Sport',
    'Party',
    'Date',
    'Vacation',
    'Other'
  ];
  
  export const CLOTHING_SEASONS = [
    'Spring',
    'Summer',
    'Fall',
    'Winter',
    'All Year'
  ];
  
  export const CLOTHING_PATTERNS = [
    'Solid',
    'Striped',
    'Plaid',
    'Checkered',
    'Floral',
    'Polka Dot',
    'Geometric',
    'Other'
  ];
  
  // Default empty clothing item
  export const DEFAULT_CLOTHING_ITEM = {
    name: '',
    description: '',
    category: CLOTHING_CATEGORIES[0],
    colors: [],
    pattern: CLOTHING_PATTERNS[0],
    occasions: [],
    seasons: [],
    brand: '',
    size: '',
    price: 0,
    purchaseDate: null,
    favorite: false,
    timesWorn: 0,
    lastWorn: null,
    imageUrl: null
  };
  
  // Event types
  export const EVENT_TYPES = [
    'Work',
    'Meeting',
    'Interview',
    'Date',
    'Party',
    'Wedding',
    'Casual',
    'Travel',
    'Other'
  ];
  
  // Default empty event
  export const DEFAULT_EVENT = {
    title: '',
    description: '',
    date: new Date(),
    type: EVENT_TYPES[0],
    location: '',
    outfitId: null,
    notes: '',
    weather: null
  };
  
  // Weather types for outfit recommendations
  export const WEATHER_TYPES = [
    'Sunny',
    'Partly Cloudy',
    'Cloudy',
    'Rainy',
    'Snowy',
    'Hot',
    'Cold',
    'Windy'
  ];
  
  // Default empty outfit
  export const DEFAULT_OUTFIT = {
    name: '',
    description: '',
    items: [], // Array of clothing item IDs
    occasion: CLOTHING_OCCASIONS[0],
    season: CLOTHING_SEASONS[0],
    weather: [],
    favorite: false,
    timesWorn: 0,
    lastWorn: null,
    imageUrl: null
  };
  
  // Helper function to create a new clothing item
  export const createClothingItem = (data = {}) => {
    return { ...DEFAULT_CLOTHING_ITEM, ...data };
  };
  
  // Helper function to create a new outfit
  export const createOutfit = (data = {}) => {
    return { ...DEFAULT_OUTFIT, ...data };
  };
  
  // Helper function to create a new event
  export const createEvent = (data = {}) => {
    return { ...DEFAULT_EVENT, ...data };
  };