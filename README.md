# beacon-gamification-app

### Setup

Beacon Adventure is a React Native application! I assume that you've already setup your machine with a proper enviroment:
- Android SDK installed and PATH exported to your .bashprofile
- react-native installed globally

You can find more details on react native site: https://facebook.github.io/react-native/

### Application constraints

Minimun SDK version for Android: 5.0 (level 21)
Application is currently deployed on Google Play Store, so you can't update directly store version without keystore from NOI Tech Park

### Installation

Install the dependencies

```sh
$ yarn install
$ npx jetify
```

### Application architecture

We're using react-navigation as default navigation system: https://reactnavigation.org/
App is following classic react-native structure, in containers folder you'll find the screens of the application (you can imagine them as the activities). In components folder instead you can find all the reusable small components.

We're also using https://github.com/IjzerenHein/react-native-shared-element for some transitions between screens. Other libraries are pretty common for react-native enviroment, we have lottie for some animation (you can find jsons inside animation folder), some lodash for utilities and others.

All code is written using functional component and hooks, new feature released in React 16.9! We're also using patch-package to manage some fixes to open source libraries. There is postinstall command already configured, so you'll use it when you do yarn install.

### Release

```gradle
...
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        ...
        // insert here keystore informations
        ...
    }
}
buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release // change the line HERE after you have configured the keytore
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
...
```

After this you can use `./gradlew assembleRelease` command like every Android app to assemble your APK

### CI

If you want to setup CI for your version of the application, you just need to execute the scripts in Installation section (after you've of course set up your CI machine with RN and Android SDK) and then run the command posted in Release section


License
----

MIT

**Free Software, Hell Yeah!**

> Made with ❤️ from Belka and NOI Tech Park

