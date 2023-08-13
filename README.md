This is a new app build by React Native CLI

# Environment Setup

## Install Android Studio

[Download and install Android Studio on Linux](https://developer.android.com/studio/install#linux)

## Install the Android SDK

1. open SDK Manager
1. select SDK Platforms, then check the box next to "Show Package Details"
1. make sure the following items are checked: Android SDK Platform 33, Google APIs Intel x86 Atom System Image
1. select the "SDK Tools", check: Android SDK Build-Tools 33.0.0, Android SDK Command-line Tools

## Configure the environment variable

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export JAVA_HOME=/opt/android-studio/jbr
export PATH=$PATH:$JAVA_HOME/bin
```

## How to generate the unsigned apk for android

create /android/app/src/main/assets

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res \
&& cd android \
&& ./gradlew clean\
&& ./gradlew assembleDebug
```
