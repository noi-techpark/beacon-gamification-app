pipeline {
    agent {
        node {
            label 'mac'
        }
    }

    stages {
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
    }
}
