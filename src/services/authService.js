// src/services/authService.js
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
  import { auth, db } from '../firebase/config';
  import * as WebBrowser from 'expo-web-browser';
  import * as Google from 'expo-auth-session/providers/google';
  import Constants from 'expo-constants';
  
  // Initialize Google sign-in for Expo
  WebBrowser.maybeCompleteAuthSession();
  
  // Function to register with email and password
  export const registerWithEmail = async (email, password, displayName) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user profile with display name
      await updateProfile(user, { displayName });
      
      // Create a user document in Firestore
      await createUserProfile(user, { displayName });
      
      return { user };
    } catch (error) {
      return { error };
    }
  };
  
  // Function to sign in with email and password
  export const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      return { error };
    }
  };
  
  // Google Sign-in hooks for Expo
  export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
      clientId: '277119900844-client-id-from-google-console.apps.googleusercontent.com', // Replace with your actual client ID
      iosClientId: Constants.manifest?.extra?.iosClientId,
      androidClientId: Constants.manifest?.extra?.androidClientId,
      webClientId: Constants.manifest?.extra?.webClientId,
    });
  
    return {
      request,
      response,
      promptAsync,
      handleGoogleSignIn: async () => {
        try {
          const result = await promptAsync();
          if (result.type === 'success') {
            const { id_token } = result.params;
            const credential = GoogleAuthProvider.credential(id_token);
            const userCredential = await signInWithCredential(auth, credential);
            
            // Check if this is a new user and create profile if needed
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (!userDoc.exists()) {
              await createUserProfile(userCredential.user);
            }
            
            return { user: userCredential.user };
          }
          return { cancelled: true };
        } catch (error) {
          return { error };
        }
      }
    };
  };
  
  // Function to handle Google sign-in for web
  export const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if this is a new user and create profile if needed
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        await createUserProfile(userCredential.user);
      }
      
      return { user: userCredential.user };
    } catch (error) {
      return { error };
    }
  };
  
  // Function to sign out
  export const logOut = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  // Function to send password reset email
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  // Helper function to create a user profile in Firestore
  export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      const { email, displayName, photoURL } = user;
      
      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt: serverTimestamp(),
          closetSize: 0,
          outfitsCreated: 0,
          ...additionalData
        });
        
        // Create initial collections for the user
        const closetRef = doc(db, `users/${user.uid}/metadata`, 'closet');
        await setDoc(closetRef, {
          lastUpdated: serverTimestamp(),
          totalItems: 0,
          categories: {
            tops: 0,
            bottoms: 0,
            dresses: 0, 
            outerwear: 0,
            shoes: 0,
            accessories: 0
          }
        });
        
        const eventsRef = doc(db, `users/${user.uid}/metadata`, 'events');
        await setDoc(eventsRef, {
          lastUpdated: serverTimestamp(),
          totalEvents: 0
        });
        
        const outfitsRef = doc(db, `users/${user.uid}/metadata`, 'outfits');
        await setDoc(outfitsRef, {
          lastUpdated: serverTimestamp(),
          totalOutfits: 0
        });
        
      } catch (error) {
        console.error("Error creating user profile", error);
      }
    }
    
    return userRef;
  };
  
  // Helper function to get current user profile data
  export const getCurrentUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching user profile", error);
      return null;
    }
  };