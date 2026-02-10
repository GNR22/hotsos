import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { supabase } from './lib/supabase';
import SOSButton from './components/SOSButton';
import EmergencyTracker from './components/EmergencyTracker';
import QuickAuth from './components/QuickAuth'; // <--- Don't forget to import this!
import ContactManager from './components/ContactManager';


export default function App() {
  const [session, setSession] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handlePanicStart = (userId) => {
    setIsEmergency(true);
    console.log("Emergency Started for user:", userId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SafeWalk</Text>
        
        {/* CONDITIONAL RENDERING LOGIC */}
        {!session ? (
          // IF NOT LOGGED IN: Show the Quick Auth Button
          <>
            <Text style={styles.warning}>Authentication Required</Text>
            <QuickAuth /> 
          </>
        ) : (
          // IF LOGGED IN: Show the Safety Features
          <>
            <Text style={styles.status}>
              System Active: {session.user.id.slice(0, 8)}...
            </Text>
            
            <SOSButton onPanicStart={(uid) => handlePanicStart(uid)} />
            
            {/* 2. The Contact Form (ADD THIS) */}
            <ContactManager userId={session.user.id} />

            <EmergencyTracker 
              isTracking={isEmergency} 
              userId={session.user.id} 
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  status: {
    fontSize: 18,
    color: 'green',
    marginBottom: 30,
  },
  warning: {
    fontSize: 18,
    color: 'orange',
    marginBottom: 30,
  }
});