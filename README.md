# Read-A-Meter

[![PhoneGap Build](https://img.shields.io/badge/phonegap-android-blue.svg)](https://build.phonegap.com/apps/1549106)

Read-A-Meter is a smartphone app to keep your meter readings. It is using [PhoneGap](http://phonegap.com/) and [JQuery Mobile](https://jquerymobile.com).
The code is based on the [swipe-list demo](http://demos.jquerymobile.com/1.4.5/swipe-list).

## Run for test on developer machine without build

Open checked out file [www/index.html](www/index.html) in a web browser.

## Build

### Prerequisites

- [Install PhoneGap/Cordova.](http://docs.phonegap.com/getting-started/1-install-phonegap/cli)
- [Install Android Platform.](https://cordova.apache.org/docs/en/latest/guide/platforms/android)
- Set `$ANDROID_HOME` to the android-sdk directory.
- Optional for more detailed console output: `npm install -g cordova`

### Developer build (debug)

    phonegap build android

or for more detailed console output (if cordova has been installed explicitly)

    cordova build android

This compiles to an apk file in `platforms/android/build/outputs/apk/android-debug.apk`.

The first time `phonegap build android` is called the android platform will be initialised.

### Problems

If you get an expection during build it might [help](http://stackoverflow.com/questions/30896591/phonegap-command-failed-with-exit-code-8) to delete your `~/.gradle` directory.

## Run for test on real device

### Prerequisites

[Get _PhoneGap Developer App_.](http://docs.phonegap.com/getting-started/2-install-mobile-app)

### Run app

Run

    phonegap serve

and [connect your phone to the server.](http://docs.phonegap.com/getting-started/4-run-your-app/cli)
