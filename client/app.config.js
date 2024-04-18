import 'dotenv/config';

export default {
  "expo": {
    "name": "StereoMath",
    "slug": "StereoMath",
    "extra": {
      "eas": {
        "projectId": process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      }
    },
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4393e9"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to display it as a background."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4390F9"
      },
      "permissions": ["CAMERA"],
      "package": "com.stereomath.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ]
    ]
  }
}
