# PixelPeel Mobile App

A Flutter Android/iOS prototype of PixelPeel AI Onion Quality Assessment.

## Features
- Login and Sign Up
- Local account persistence for prototype/demo use
- Select one or multiple onion images from the phone gallery
- Flexible image display for different image sizes/aspect ratios
- AI-style scanning animation over the uploaded image
- Onion quality categories: Healthy, Damaged, Rotten, Sprouted, Undersized
- Grade A and URS summary
- Digital report view
- Responsive Material 3 mobile UI

## Run in Android Studio / VS Code
1. Install Flutter SDK and Android Studio.
2. Open the `mobile_app` folder as a Flutter project.
3. Run `flutter pub get`.
4. Connect an Android phone with USB debugging enabled or start an Android emulator.
5. Run `flutter run`.

## Prototype note
The current scan classification is demo data. The next production step is connecting the scan function to the PixelPeel YOLO/OpenCV/FastAPI backend so uploaded onions are genuinely detected and classified.

Account and scan state in this prototype are stored locally on the device. For production, use Firebase Authentication and Firestore (or another secure backend).
