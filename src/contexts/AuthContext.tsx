import React, {createContext, useContext, useEffect, useState} from 'react';

import {signup} from '@/api';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '282246666720-bppmahgbs1vc2dtn4auck7fpr59jtu79.apps.googleusercontent.com',
  offlineAccess: true,
});

type Props = {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  signInWithGoogle: () => Promise<FirebaseAuthTypes.User | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Props>({
  user: null,
  initializing: true,
  signInWithGoogle: async () => {
    return null;
  },
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async firebaseUser => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await firebaseUser.getIdToken(true); // 강제 토큰 갱신
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      if (result.type === 'cancelled') {
        return null;
      }

      const {idToken} = await GoogleSignin.getTokens();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      await signup(userCredential.user.uid);

      return userCredential.user;
    } catch (error) {
      console.error(`[AuthProvider] Error signing in with Google: ${error}`);
      throw error;
    }
  };

  const signOut = async () => {
    await GoogleSignin.signOut();
    await auth().signOut();
  };

  // signOut();

  return <AuthContext.Provider value={{user, initializing, signInWithGoogle, signOut}}>{children}</AuthContext.Provider>;
};
