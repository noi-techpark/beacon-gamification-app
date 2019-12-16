# beacon-gamification-app

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

### TODO

iOS Support

License
----

MIT

**Free Software, Hell Yeah!**

> Made with ❤️ from Belka and NOI Tech Park

