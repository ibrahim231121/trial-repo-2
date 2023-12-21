  pipeline {
    agent any

    environment {
        Go111MODULE='on'
    }
    stages {
            steps {
                git 'https://github.com/ibrahim231121/trial-repo-2.git'
                sh 'go test ./...'
            }
        }
    }
