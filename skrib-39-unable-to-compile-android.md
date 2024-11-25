I was unable to compile the expo go app on Android

since all Java code intended for encryption will be un usable.
Here is the compromise:
- convert all encryption java files to javascript or typescript
- connect the typescript module to the frontend
  - this should be simple because no compilation will be needed; the expo web bundler will handle this fine

Here are the steps taken to attempt to compile the app on Android
- install Java 17 any other version of Java did not work
- install Android SDK
- install NDK in Android Studio
- set JAVA_HOME in Windows system environment variables to point to jdk
- set ANDROID_HOME in Windows system environment variables to point to sdk
- create and launch a virtual environment in Android Studio
- run the following commands:
  - npm i
  - expo upgrade
  - npx expo prebuild --clean (creates android subdir)
  - cd android
  - ./gradlew clean (not sure the reason for this)
  - cd ..
  - expo run:android (this process either failed or the app didn't display correctly in the virtual environment)
