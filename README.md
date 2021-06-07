# ChatApp
A react native application utilitzing gifted-chat and Google Firebase to offer a real-time chat experience on iOS and Android.
## Getting started
## Setting Up a React Native Project

#### Setting Up Expo and Your Development Environment
--you need to install NOde.js, and  the Expo CLI in your terminal with this command:

`
npm install expo-cli --global
`

-not forget to download the Expo app on your mobile device, so that you can run the app directly from the Expo app.
##### Expo account 
 Head over to the Expo signup page [Expo sign-up page](https://expo.io/signup)

 #### Setting Up an Emulator and Simulator
##### Setting up a simulator for iOS
In order for the iOS simulator to run this app, [Xcode](https://developer.apple.com/xcode/resources/ "Xcode") needs to be installed. After installing XCode, open it up and head over to "Preferences." From there, click "Components" and install a simulator from the list. Open the simulator, start your Expo project, and click "Run on iOS simulator" or simply type "i" in the Expo CLI.

##### Setting up an emulator for Android
To set up Android Emulator, you first need to download and install [Android Studio](https://docs.expo.io/versions/v32.0.0/workflow/android-studio-emulator/ "Android Studio"). To do this, follow the on-screen installation instructions and make sure you **don't** untick the "Android Virtual Device" option in the installation dialog.

After the installation is complete, start Android Studio, click "Configure" and go to Settings -> Appearance & Behaviour -> System Settings -> Android SDK. Click the "SDK Tools" tab and check that you have "Android SDK Build-Tools" installed. If your "Android SDK Build-Tools" aren't installed, click on the "Android SDK Build-Tools” row, then download the latest version by clicking on the download symbol that appears next to it.

## required Libraries
To install all dependencies you can run:

 `npm i --save @react-native-community/async-storage @react-native-community/masked-view @react-native-community/netinfo @react-navigation/native @react-navigation/stack babel-preset-env better-docs expo expo-font expo-image-picker expo-location expo-permissions expo-updates firebase fsevents prop-types react react-dom react-google-maps react-native react-native-gesture-handler react-native-gifted-chat react-native-keyboard-spacer react-native-maps react-native-parsed-text react-native-reanimated react-native-safe-area-context react-native-screens react-native-svg react-native-web react-native-web-maps react-navigaion react-navigation-stack`

## Setting up Firebase account!
----
##### You should set up a firebase account for your own use (faster speeds/requests) Follow this guide for easy setup.
1) Go to [Firebase](https://firebase.google.com).
2) Sign into your google account (or create a new one).
3) Click on "Go to Console"
4) Click "Add Project"
5) Follow instructions presented by Firebase until you reach a screen that says "Creating your project".
6) Click on "database" in the Develop tab.
7) Click on "Create Database" and select "Start in test mode".
8) Click on "Start Collection" and name it "messages" then press "auto id" and confirm the selections on the following screen.
9) Click on "Authentication", then click "Set up sign-in method" and enable anonymous authentication.
10 Click on "storage" to set up cloud storage
11) Now you can click on the little gear/cog just above your Develop tab. Select "project settings". Click on a button that looks like this: `</>` to add Firebase to a web app, name the project.
12) Once your project is named copy everything in the "firebaseConfig" section and paste it into your Chat.js file.
## EX: 
#### To initialize Firebase in your app: add the following to your constructor()

```sh
constructor() {
    super();
    this.state = {
        messages: []
    };
    if (!firebase.apps.length) {
        firebase.initializeApp({
        apiKey: 'YOUR_API_KEY',
        authDomain: 'YOUR_AUTH_DOMAIN',
        databaseURL: 'YOUR_DATABASE_URL',
        projectID: 'YOUR_PROJ_ID',
        storageBucket: 'YOUR_BUCKET',
        messagingSenderId: 'YOUR_SENDER_ID',
        appId: 'YOUR_APP_ID',
        measurementID: 'YOUR_MEASUREMENT_ID'
        })
    }
    
    // refers to messages collection in firebase DB
    this.referenceMessages = firebase.firestore().collection('messages');
}
```
 ## Starting the App
 All the configuration is now complete and your able to run the chat app. Navigate to the cloned or downloaded repository in your terminal and type:

`expo start`