import * as Location from "expo-location";
import { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function SOSButton({ onPanicStart }) {
  const [loading, setLoading] = useState(false);

  const handlePanic = async () => {
    // DEBUG 1: Did the button actually feel the press?
    Alert.alert("Debug", "1. Button Pressed! Starting...");
    setLoading(true);
    Vibration.vibrate(500);

    try {
      // DEBUG 2: Check User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Debug Error", "No User Found");
        return;
      }

      // DEBUG 3: Fetch Contacts
      const { data: contacts, error } = await supabase
        .from("trusted_contacts")
        .select("contact_phone")
        .eq("user_id", user.id);

      if (error) {
        Alert.alert("Debug Error", "DB Error: " + error.message);
        return;
      }
      if (!contacts || contacts.length === 0) {
        Alert.alert("Debug Error", "No contacts found in DB.");
        return;
      }

      Alert.alert("Debug", `2. Found ${contacts.length} contact(s).`);

      // DEBUG 4: Prepare the Link (SIMPLIFIED)
      // We will try to send to JUST THE FIRST contact to rule out separator bugs
      const firstNumber = contacts[0].contact_phone;

      // Get Location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const mapLink = `https://statuesque-crisp-47480a.netlify.app/?id=${user.id}`;
      const message = `HELP! I am at ${latitude}, ${longitude}. Track: ${mapLink}`;

      // Construct URL
      const separator = Platform.OS === "android" ? "?" : "&";
      const smsUrl = `sms:${firstNumber}${separator}body=${encodeURIComponent(message)}`;

      Alert.alert("Debug", "3. Attempting to open SMS...");

      // DEBUG 5: Just Open It (Skip canOpenURL check which fails on Android 11+)
      await Linking.openURL(smsUrl);

      Alert.alert("Debug", "4. Success! App should be open.");

      if (onPanicStart) onPanicStart(user.id);
    } catch (err) {
      Alert.alert("CRITICAL ERROR", err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onLongPress={handlePanic}
        delayLongPress={1000} // Reduced time to make it easier to test
      >
        <Text style={styles.text}>{loading ? "..." : "SOS"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  text: { color: "white", fontSize: 48, fontWeight: "bold" },
});
