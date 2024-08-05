# Event Vista

Welcome to Event Vista! This application is designed to streamline event management and participation, providing features for both organizers and clients.

# Features

For Organizers
Event Creation: Organizers can create events with details including a poster, name, description, address, and participant limits. Use our AI feature to automatically pre-populate event details by uploading an image of the event poster.
Manage Participants: Set the maximum number of participants and remove clients who wish to join the event.
Real-Time Updates: Receive notifications about participants joining or leaving the event.
Chat Room: Automatically creates a chat room for each event where the organizer and participants can interact.
Automatic Deletion: Events and associated chat rooms are automatically deleted once the event’s start date is over.

# For Ticket Seekers

Event Discovery: Set your location and view events near you.
Participation: Join events, leave events, and get real-time updates about new ticket seekers.
Chat Room: Participate in the event's chat room to interact with other participants and the organizer.

# Set Up the Backend:

Follow the backend setup instructions in the backend repository https://github.com/Manshu-Chatrath/EventVistaBackEnd and https://github.com/Manshu-Chatrath/EventVistaWorker.
Ensure the backend server is running and accessible from your local machine.

# Configure API key

You need an API key for GooglePlacesAutoComplete and make a key.js file and put export const GOOGLE_KEY and the import it at suitable places.

## Requirements

- **Node.js**: Version 18.x.x or later is required. This ensures compatibility with the latest JavaScript features and libraries.
- **Expo**: Version 51.0.0. Expo CLI should be installed globally to run the application on mobile platforms.
- **React Native**: Ensure you have the necessary setup for React Native development.

# Setup

To run this application on your local machine, follow these steps:
Node.js: This project requires Node.js version 18.x.x or later. Ensure you have the correct version installed to avoid compatibility issues.
React Native
Framework: This application is built using React Native and Expo. Ensure you have Expo CLI installed globally if running on mobile platforms:
npm install -g expo-cli
git clone [your-repository-url]
npm install
change the baseUrl of variable called apiSlice(you can find the variable inside apiSlice folder in file index.ts) and do the same thing with websocket connection (you can find it in app.js) and change the string 10.0.0.128 to your ipAddress
npm start
press a to run it in android emulator/install the expo app on android and scan the qr code to run the app

# AI Feature for Organizers

When creating an event, organizers can leverage the AI feature:
AI-Powered Event Creation: Upload an image of your event poster. The AI will automatically analyze the image and pre-populate the event details for you, such as event name, description, and location.

# Screenshots

<img src="https://github.com/user-attachments/assets/56cbd085-486d-4efc-abce-d46befe2f32a" alt="Screenshot 1" width="400" />
<img src="https://github.com/user-attachments/assets/5cc6c12e-8394-4c1e-bc81-038adc2aad49" alt="Screenshot 2" width="400" />
<img src="https://github.com/user-attachments/assets/67eade48-b3ea-4f34-887f-21111138176f" alt="Screenshot 3" width="400" />
<img src="https://github.com/user-attachments/assets/90fdaad4-94d7-4360-95f0-41ec51e82f33" alt="Screenshot 4" width="400" />
<img src="https://github.com/user-attachments/assets/4cfcfd99-b0b3-4327-913f-6317a575fb94" alt="Screenshot 5" width="400" />
<img src="https://github.com/user-attachments/assets/00043d60-99a2-4b71-bbf5-dfb1300c4ff6" alt="Screenshot 6" width="400" />
<img src="https://github.com/user-attachments/assets/bff042bc-226a-4183-8149-aa8945f384ab" alt="Screenshot 7" width="400" />

# Tutorial Video

https://youtu.be/FJ8zkDyCUhY?feature=shared
