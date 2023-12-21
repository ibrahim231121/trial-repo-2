  pipeline {
    agent any

    environment {
        Go111MODULE='on'
    }
  stages {
        stage('Test') {
            steps {
                git 'https://github.com/ibrahim231121/trial-repo-2.git'
            }
        }
     }
  }
  stage('Build & Test') {
      agent {
        docker {
          image 'node:14.17.1-alpine'
          label 'frontend'
          args '-v /var/lib/git-mirror:/var/lib/git-mirror'
          reuseNode true
        }
      }
  }
