# beacon-gamification-app

### Dependencies

* [react-native-google-signin] - To match your photos with ours
* [react-native-navigation] - awesome native-based library for navigation
* [lottie-react-native] - for some fancy animations
* [open-data-hub-APIS] - from Sudtirol with ❤️

### Installation

I assume that enviroment on your machine is already setted up to develop Android applications

Install the dependencies

```sh
$ yarn install
$ npx jetify
```

### Release

```gradle
...
buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug // change the line HERE after you have configured the keytore
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
...
```

After this you can use `./gradlew assembleRelease` command like every Android app to assemble your APK

License
----

MIT

**Free Software, Hell Yeah!**

> Made with ❤️ from Belka and NOI Tech Park

