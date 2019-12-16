pipeline {
    agent {
        node {
            label 'mac'
        }
    }

    parameters {
        string(name: 'VERSION_NAME', defaultValue: '1.0.0', description: 'App Version Name')
    }

    environment {
        UPLOAD_STORE_PATH = "${WORKSPACE}/android/app/upload.keystore"
        UPLOAD_STORE_FILE = credentials('beacon-gamification-app-upload-store-file')
        UPLOAD_STORE_PASSWORD = credentials('beacon-gamification-app-upload-store-password')
        UPLOAD_KEY_ALIAS = credentials('beacon-gamification-app-upload-key-alias')
        UPLOAD_KEY_PASSWORD = credentials('beacon-gamification-app-upload-key-password')
        SUPPLY_JSON_KEY = credentials('beacon-gamification-app-fastlane-google-play-api-key')
    }

    stages {
        stage('Configure') {
            steps {
                ansiColor('xterm') {
                    sh 'cat "${UPLOAD_STORE_FILE}" > ${UPLOAD_STORE_PATH}'
                }
            }
        }
        stage('Dependencies') {
            steps {
                ansiColor('xterm') {
                    sh 'yarn install'

                    sh 'cd android && bundle install --path=vendor/bundle'
                    sh 'cd android && bundle update'
                }
            }
        }
        stage('Test') {
            steps {
                ansiColor('xterm') {
                    sh 'cd android && bundle exec fastlane test'
                }
            }
        }
        stage('Build & Deploy') {
            steps {
                ansiColor('xterm') {
                    sh 'cd android && bundle exec fastlane alpha'
                }
            }
        }
        stage('Version Bump') {
            steps {
                ansiColor('xterm') {
                    sshagent (credentials: ['jenkins_github_ssh_key']) {
                        sh 'git remote set-url origin git@github.com:noi-techpark/beacon-gamification-app.git'
                        sh 'git add android/app/build.gradle'
                        sh 'git commit -m "Version increment"'
                        sh 'git push origin HEAD:development'
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'rm -rf keystore.jks'            
            sh 'rm -rf app/src/release/res/values/facebook_api.xml'           
            sh 'rm -rf app/src/release/res/values/google_maps_api.xml'            
            sh 'rm -rf app/google-services.json'
            sh 'rm -rf app/src/debug/google-services.json'            
        }
    }
}
