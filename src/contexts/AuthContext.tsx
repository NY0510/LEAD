import React, {createContext, useContext, useEffect, useState} from 'react';

import {useDemo} from './DemoContext';
import {signup} from '@/api/apiRouter';
import {DEMO_USER} from '@/lib/demoData';
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
  signInWithDemo: () => Promise<FirebaseAuthTypes.User | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Props>({
  user: null,
  initializing: true,
  signInWithGoogle: async () => {
    return null;
  },
  signInWithDemo: async () => {
    return null;
  },
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const {isDemoMode, enableDemoMode} = useDemo();

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
      await signup(userCredential.user.uid, userCredential.user.displayName || '');

      return userCredential.user;
    } catch (error) {
      console.error(`[AuthProvider] Error signing in with Google: ${error}`);
      throw error;
    }
  };

  const signInWithDemo = async () => {
    try {
      // 데모 모드 활성화
      enableDemoMode();

      // 더미 사용자 객체 생성 (Firebase User 형태로 맞춤)
      const demoUser = {
        uid: DEMO_USER.uid,
        displayName: DEMO_USER.username,
        email: 'demo@example.com',
      } as unknown as FirebaseAuthTypes.User;

      setUser(demoUser);
      return demoUser;
    } catch (error) {
      console.error(`[AuthProvider] Error signing in with demo: ${error}`);
      throw error;
    }
  };

  const signOut = async () => {
    if (isDemoMode) {
      // 데모 모드에서는 Firebase 로그아웃 없이 바로 상태만 초기화
      setUser(null);
    } else {
      await GoogleSignin.signOut();
      await auth().signOut();
    }
  };

  // signOut();

  return <AuthContext.Provider value={{user, initializing, signInWithGoogle, signInWithDemo, signOut}}>{children}</AuthContext.Provider>;
};
