// src/services/firestoreService.js
import { 
    collection, 
    doc, 
    addDoc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    increment
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { auth, db, storage } from '../firebase/config';
  
  // ------------------ USER PROFILE FUNCTIONS ------------------
  
  export const updateUserProfile = async (userData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
  
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { error };
    }
  };
  
  // ------------------ CLOSET ITEM FUNCTIONS ------------------
  
  // Add a new clothing item to the user's closet
  export const addClothingItem = async (itemData, imageUri) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Upload image if provided
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadClothingImage(imageUri, user.uid);
      }
      
      // Create the clothing item document
      const clothingRef = collection(db, `users/${user.uid}/closet`);
      const newItemRef = await addDoc(clothingRef, {
        ...itemData,
        imageUrl,
        createdAt: serverTimestamp(),
        lastWorn: null,
        timesWorn: 0,
        favorite: false,
        owner: user.uid
      });
      
      // Update closet metadata
      const closetMetaRef = doc(db, `users/${user.uid}/metadata`, 'closet');
      await updateDoc(closetMetaRef, {
        lastUpdated: serverTimestamp(),
        totalItems: increment(1),
        [`categories.${itemData.category.toLowerCase()}`]: increment(1)
      });
      
      // Also update user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        closetSize: increment(1),
        updatedAt: serverTimestamp()
      });
      
      return { 
        id: newItemRef.id, 
        ...itemData, 
        imageUrl,
        createdAt: new Date(),
        timesWorn: 0,
        favorite: false 
      };
    } catch (error) {
      console.error('Error adding clothing item:', error);
      return { error };
    }
  };
  
  // Upload clothing image to Firebase Storage
  export const uploadClothingImage = async (uri, userId) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const timestamp = Date.now();
      const storageRef = ref(storage, `users/${userId}/closet/${timestamp}`);
      
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  // Get all clothing items for the current user
  export const getClothingItems = async (filters = {}) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const clothingRef = collection(db, `users/${user.uid}/closet`);
      
      // Build query based on filters
      let clothingQuery = clothingRef;
      
      if (filters.category) {
        clothingQuery = query(clothingQuery, where('category', '==', filters.category));
      }
      
      if (filters.color) {
        clothingQuery = query(clothingQuery, where('colors', 'array-contains', filters.color));
      }
      
      if (filters.occasion) {
        clothingQuery = query(clothingQuery, where('occasions', 'array-contains', filters.occasion));
      }
      
      if (filters.favorite) {
        clothingQuery = query(clothingQuery, where('favorite', '==', true));
      }
      
      // Add sorting
      clothingQuery = query(clothingQuery, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(clothingQuery);
      
      const items = [];
      snapshot.forEach(doc => {
        items.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || null,
          lastWorn: doc.data().lastWorn?.toDate() || null
        });
      });
      
      return items;
    } catch (error) {
      console.error('Error getting clothing items:', error);
      return { error };
    }
  };
  
  // Get a single clothing item by ID
  export const getClothingItemById = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const itemRef = doc(db, `users/${user.uid}/closet`, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }
      
      return {
        id: itemDoc.id,
        ...itemDoc.data(),
        createdAt: itemDoc.data().createdAt?.toDate() || null,
        lastWorn: itemDoc.data().lastWorn?.toDate() || null
      };
    } catch (error) {
      console.error('Error getting clothing item:', error);
      return { error };
    }
  };
  
  // Update a clothing item
  export const updateClothingItem = async (itemId, itemData, newImageUri = null) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Get the original item to check for category changes
      const originalItemRef = doc(db, `users/${user.uid}/closet`, itemId);
      const originalDoc = await getDoc(originalItemRef);
      
      if (!originalDoc.exists()) {
        throw new Error('Item not found');
      }
      
      const originalItem = originalDoc.data();
      
      // Upload new image if provided
      let updateData = { ...itemData };
      
      if (newImageUri) {
        const imageUrl = await uploadClothingImage(newImageUri, user.uid);
        updateData.imageUrl = imageUrl;
      }
      
      // Update the item
      await updateDoc(originalItemRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      // If category changed, update the metadata counts
      if (originalItem.category !== itemData.category) {
        const closetMetaRef = doc(db, `users/${user.uid}/metadata`, 'closet');
        
        await updateDoc(closetMetaRef, {
          [`categories.${originalItem.category.toLowerCase()}`]: increment(-1),
          [`categories.${itemData.category.toLowerCase()}`]: increment(1),
          lastUpdated: serverTimestamp()
        });
      }
      
      return { 
        id: itemId,
        ...originalItem,
        ...updateData,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating clothing item:', error);
      return { error };
    }
  };
  
  // Delete a clothing item
  export const deleteClothingItem = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Get the original item to update category counts
      const itemRef = doc(db, `users/${user.uid}/closet`, itemId);
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }
      
      const itemData = itemDoc.data();
      
      // Delete the item
      await deleteDoc(itemRef);
      
      // Update closet metadata
      const closetMetaRef = doc(db, `users/${user.uid}/metadata`, 'closet');
      await updateDoc(closetMetaRef, {
        lastUpdated: serverTimestamp(),
        totalItems: increment(-1),
        [`categories.${itemData.category.toLowerCase()}`]: increment(-1)
      });
      
      // Update user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        closetSize: increment(-1),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, id: itemId };
    } catch (error) {
      console.error('Error deleting clothing item:', error);
      return { error };
    }
  };

// Toggle favorite status of an item
export const toggleFavoriteItem = async (itemId, isFavorite) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const itemRef = doc(db, `users/${user.uid}/closet`, itemId);
      await updateDoc(itemRef, {
        favorite: isFavorite,
        updatedAt: serverTimestamp()
      });
      
      return { success: true, id: itemId, favorite: isFavorite };
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      return { error };
    }
  };
  
  // Update last worn date for an item
  export const updateItemWornDate = async (itemId, date = new Date()) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const itemRef = doc(db, `users/${user.uid}/closet`, itemId);
      await updateDoc(itemRef, {
        lastWorn: date,
        timesWorn: increment(1),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, id: itemId, lastWorn: date };
    } catch (error) {
      console.error('Error updating worn date:', error);
      return { error };
    }
  };
  
  // ------------------ OUTFIT FUNCTIONS ------------------
  
  // Create a new outfit
  export const createOutfit = async (outfitData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Create the outfit document
      const outfitRef = collection(db, `users/${user.uid}/outfits`);
      const newOutfitRef = await addDoc(outfitRef, {
        ...outfitData,
        createdAt: serverTimestamp(),
        lastWorn: null,
        timesWorn: 0,
        owner: user.uid
      });
      
      // Update outfits metadata
      const outfitsMetaRef = doc(db, `users/${user.uid}/metadata`, 'outfits');
      await updateDoc(outfitsMetaRef, {
        lastUpdated: serverTimestamp(),
        totalOutfits: increment(1)
      });
      
      // Update user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        outfitsCreated: increment(1),
        updatedAt: serverTimestamp()
      });
      
      return { 
        id: newOutfitRef.id, 
        ...outfitData,
        createdAt: new Date(),
        timesWorn: 0
      };
    } catch (error) {
      console.error('Error creating outfit:', error);
      return { error };
    }
  };
  
  // Get all outfits for the current user
  export const getOutfits = async (filters = {}) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const outfitsRef = collection(db, `users/${user.uid}/outfits`);
      
      // Build query based on filters
      let outfitsQuery = outfitsRef;
      
      if (filters.occasion) {
        outfitsQuery = query(outfitsQuery, where('occasion', '==', filters.occasion));
      }
      
      if (filters.season) {
        outfitsQuery = query(outfitsQuery, where('season', '==', filters.season));
      }
      
      if (filters.weather) {
        outfitsQuery = query(outfitsQuery, where('weather', '==', filters.weather));
      }
      
      // Add sorting
      outfitsQuery = query(outfitsQuery, orderBy('createdAt', 'desc'));
      
      // Apply limit if specified
      if (filters.limit) {
        outfitsQuery = query(outfitsQuery, limit(filters.limit));
      }
      
      const snapshot = await getDocs(outfitsQuery);
      
      const outfits = [];
      snapshot.forEach(doc => {
        outfits.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || null,
          lastWorn: doc.data().lastWorn?.toDate() || null
        });
      });
      
      return outfits;
    } catch (error) {
      console.error('Error getting outfits:', error);
      return { error };
    }
  };
  
  // Get a single outfit by ID
  export const getOutfitById = async (outfitId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const outfitRef = doc(db, `users/${user.uid}/outfits`, outfitId);
      const outfitDoc = await getDoc(outfitRef);
      
      if (!outfitDoc.exists()) {
        throw new Error('Outfit not found');
      }
      
      return {
        id: outfitDoc.id,
        ...outfitDoc.data(),
        createdAt: outfitDoc.data().createdAt?.toDate() || null,
        lastWorn: outfitDoc.data().lastWorn?.toDate() || null
      };
    } catch (error) {
      console.error('Error getting outfit:', error);
      return { error };
    }
  };
  
  // Update an outfit
  export const updateOutfit = async (outfitId, outfitData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const outfitRef = doc(db, `users/${user.uid}/outfits`, outfitId);
      
      await updateDoc(outfitRef, {
        ...outfitData,
        updatedAt: serverTimestamp()
      });
      
      return { 
        id: outfitId,
        ...outfitData,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating outfit:', error);
      return { error };
    }
  };
  
  // Delete an outfit
  export const deleteOutfit = async (outfitId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const outfitRef = doc(db, `users/${user.uid}/outfits`, outfitId);
      await deleteDoc(outfitRef);
      
      // Update outfits metadata
      const outfitsMetaRef = doc(db, `users/${user.uid}/metadata`, 'outfits');
      await updateDoc(outfitsMetaRef, {
        lastUpdated: serverTimestamp(),
        totalOutfits: increment(-1)
      });
      
      // Update user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        outfitsCreated: increment(-1),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, id: outfitId };
    } catch (error) {
      console.error('Error deleting outfit:', error);
      return { error };
    }
  };
  
  // Mark outfit as worn
  export const markOutfitAsWorn = async (outfitId, date = new Date()) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const outfitRef = doc(db, `users/${user.uid}/outfits`, outfitId);
      const outfitDoc = await getDoc(outfitRef);
      
      if (!outfitDoc.exists()) {
        throw new Error('Outfit not found');
      }
      
      const outfitData = outfitDoc.data();
      
      // Update the outfit
      await updateDoc(outfitRef, {
        lastWorn: date,
        timesWorn: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // Also update the lastWorn date for each clothing item in the outfit
      if (outfitData.items && outfitData.items.length > 0) {
        for (const itemId of outfitData.items) {
          await updateItemWornDate(itemId, date);
        }
      }
      
      return { 
        success: true, 
        id: outfitId, 
        lastWorn: date,
        timesWorn: (outfitData.timesWorn || 0) + 1
      };
    } catch (error) {
      console.error('Error marking outfit as worn:', error);
      return { error };
    }
  };
  
  // ------------------ EVENT FUNCTIONS ------------------
  
  // Add a new event with planned outfit
  export const addEvent = async (eventData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Create the event document
      const eventsRef = collection(db, `users/${user.uid}/events`);
      const newEventRef = await addDoc(eventsRef, {
        ...eventData,
        createdAt: serverTimestamp(),
        owner: user.uid
      });
      
      // Update events metadata
      const eventsMetaRef = doc(db, `users/${user.uid}/metadata`, 'events');
      await updateDoc(eventsMetaRef, {
        lastUpdated: serverTimestamp(),
        totalEvents: increment(1)
      });
      
      return { 
        id: newEventRef.id, 
        ...eventData,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error adding event:', error);
      return { error };
    }
  };
  
  // Get all events for the current user
  export const getEvents = async (filters = {}) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const eventsRef = collection(db, `users/${user.uid}/events`);
      
      // Build query based on filters
      let eventsQuery = eventsRef;
      
      if (filters.startDate) {
        eventsQuery = query(eventsQuery, where('date', '>=', filters.startDate));
      }
      
      if (filters.endDate) {
        eventsQuery = query(eventsQuery, where('date', '<=', filters.endDate));
      }
      
      if (filters.type) {
        eventsQuery = query(eventsQuery, where('type', '==', filters.type));
      }
      
      // Add sorting by date
      eventsQuery = query(eventsQuery, orderBy('date', 'asc'));
      
      // Apply limit if specified
      if (filters.limit) {
        eventsQuery = query(eventsQuery, limit(filters.limit));
      }
      
      const snapshot = await getDocs(eventsQuery);
      
      const events = [];
      snapshot.forEach(doc => {
        events.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || null,
          createdAt: doc.data().createdAt?.toDate() || null
        });
      });
      
      return events;
    } catch (error) {
      console.error('Error getting events:', error);
      return { error };
    }
  };
  
  // Get a single event by ID
  export const getEventById = async (eventId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const eventRef = doc(db, `users/${user.uid}/events`, eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      return {
        id: eventDoc.id,
        ...eventDoc.data(),
        date: eventDoc.data().date?.toDate() || null,
        createdAt: eventDoc.data().createdAt?.toDate() || null
      };
    } catch (error) {
      console.error('Error getting event:', error);
      return { error };
    }
  };
  
  // Update an event
  export const updateEvent = async (eventId, eventData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const eventRef = doc(db, `users/${user.uid}/events`, eventId);
      
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp()
      });
      
      return { 
        id: eventId,
        ...eventData,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return { error };
    }
  };
  
  // Delete an event
  export const deleteEvent = async (eventId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const eventRef = doc(db, `users/${user.uid}/events`, eventId);
      await deleteDoc(eventRef);
      
      // Update events metadata
      const eventsMetaRef = doc(db, `users/${user.uid}/metadata`, 'events');
      await updateDoc(eventsMetaRef, {
        lastUpdated: serverTimestamp(),
        totalEvents: increment(-1)
      });
      
      return { success: true, id: eventId };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { error };
    }
  };
  
  // ------------------ ANALYTICS FUNCTIONS ------------------
  
  // Get closet analytics data
  export const getClosetAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Get all clothing items
      const { error, ...items } = await getClothingItems();
      
      if (error) throw error;
      
      // Calculate analytics
      const totalItems = items.length;
      const categoryCounts = {};
      const colorCounts = {};
      const leastWorn = [...items].sort((a, b) => (a.timesWorn || 0) - (b.timesWorn || 0)).slice(0, 5);
      const mostWorn = [...items].sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0)).slice(0, 5);
      const neverWorn = items.filter(item => !item.timesWorn || item.timesWorn === 0);
      
      // Calculate cost per wear for items with price information
      const itemsWithCostPerWear = items
        .filter(item => item.price && item.price > 0)
        .map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          timesWorn: item.timesWorn || 0,
          costPerWear: item.price / (item.timesWorn || 1)
        }))
        .sort((a, b) => b.costPerWear - a.costPerWear);
      
      // Count by category
      items.forEach(item => {
        // Category count
        const category = item.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        
        // Color count
        if (item.colors && Array.isArray(item.colors)) {
          item.colors.forEach(color => {
            colorCounts[color] = (colorCounts[color] || 0) + 1;
          });
        }
      });
      
      return {
        totalItems,
        categoryCounts,
        colorCounts,
        leastWorn,
        mostWorn,
        neverWorn: neverWorn.length,
        itemsWithCostPerWear: itemsWithCostPerWear.slice(0, 10),
        averageWears: items.reduce((sum, item) => sum + (item.timesWorn || 0), 0) / totalItems
      };
    } catch (error) {
      console.error('Error getting closet analytics:', error);
      return { error };
    }
  };
  
  // Get outfit analytics data
  export const getOutfitAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Get all outfits
      const { error, ...outfits } = await getOutfits();
      
      if (error) throw error;
      
      // Calculate analytics
      const totalOutfits = outfits.length;
      const occasionCounts = {};
      const seasonCounts = {};
      const mostWorn = [...outfits].sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0)).slice(0, 5);
      
      // Count by occasion and season
      outfits.forEach(outfit => {
        // Occasion count
        const occasion = outfit.occasion || 'Uncategorized';
        occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
        
        // Season count
        const season = outfit.season || 'Any';
        seasonCounts[season] = (seasonCounts[season] || 0) + 1;
      });
      
      return {
        totalOutfits,
        occasionCounts,
        seasonCounts,
        mostWorn,
        averageWears: outfits.reduce((sum, outfit) => sum + (outfit.timesWorn || 0), 0) / Math.max(totalOutfits, 1)
      };
    } catch (error) {
      console.error('Error getting outfit analytics:', error);
      return { error };
    }
  };