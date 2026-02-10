# Framework 
-Language: JavaScript (React)
-Framework: Expo (The beginner-friendly, fast-track version of React Native)
-Testing Tool: Expo Go (The app on your phone that runs your code)
-Backend: Supabase (The database and auth)

# SafetyApp Project Structure Documentation

This document outlines the core architecture and file responsibilities for the Women and Children Safety App.

---

### 1. `App.js` (The Brain)
* **What it is:** The root of your application.
* **What it does:**
    * Checks if the user is logged in (via Supabase).
    * Determines if an emergency is active.
    * Renders the `SOSButton` on the screen.
    * Acts as the central traffic controller for the app state.

---

### 2. `lib/supabase.js` (The Bridge)
* **What it is:** The configuration file.
* **What it does:**
    * Holds your API Keys (Project URL and Anon Key).
    * Creates the connection between your mobile app and the Supabase cloud database.
    * Imported whenever the app needs to save or fetch data.

---

### 3. `components/SOSButton.js` (The Trigger)
* **What it is:** The visible Red Button on the screen.
* **What it does:**
    * Handles the **Long Press** interaction (to prevent accidental touches).
    * Vibrates the phone to confirm activation.
    * Gets the single-time GPS location immediately.
    * Opens the native SMS app with a pre-filled "Help" message.
    * Signals Supabase that "Emergency Started" so tracking can begin.

---

### 4. `components/EmergencyTracker.js` (The Engine)
* **What it is:** A logic component (it renders nothing visible).
* **What it does:**
    * "Wakes up" once the SOS is pressed.
    * Watches the user's movement in the background.
    * Updates the specific row in the Supabase database every 5 seconds.
    * Enables trusted contacts to see the user moving in real-time on their own devices.

---

### 5. `utils/getAddress.js` (The Translator)
* **What it is:** A utility function.
* **What it does:**
    * Takes raw GPS numbers (e.g., `8.9475, 125.5406`).
    * Queries OpenStreetMap to ask, "What street is this?"
    * Returns a human-readable string (e.g., *"J.C. Aquino Ave, Butuan City"*) to be inserted into the SMS message.