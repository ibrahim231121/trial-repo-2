GIT_COMMIT = ''

pipeline {
  agent {
    label 'docker&&linux'
  }

  options {
    ansiColor('xterm')
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '50')
    disableResume()
    skipDefaultCheckout true
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          GIT_COMMIT = checkout([
            $class: 'GitSCM',
            branches: [[name: scm.branches[0].name]],
            doGenerateSubmoduleConfigurations: false,
            extensions: [
              [$class: 'CloneOption', noTags: false, reference: '/var/lib/git-mirror/crossbones-webui', shallow: false],
              [$class: 'LocalBranch', localBranch: scm.branches[0].name.replaceAll('^origin/', '')],
              [$class: 'RelativeTargetDirectory', relativeTargetDir: 'src'],
              [$class: 'CleanCheckout']
            ],
            submoduleCfg: [],
            userRemoteConfigs: [
              [credentialsId: 'ssh-jenkins', url: 'git@bitbucket.org:irsavideo/crossbones-webui.git']
            ]
          ]).GIT_COMMIT
        }
      }
    }
    stage('Build & Test') {
      agent {
        docker {
          image 'node:14.17.1-alpine'
          label 'docker&&linux'
          args '-v /var/lib/git-mirror:/var/lib/git-mirror'
          reuseNode true
        }
      }
      environment {
        HOME = "${WORKSPACE}"
        NODE_ENV = 'development'
      }
      steps {
        dir('publish') {
          deleteDir()
        }
        dir('src') {
          buildName "1.0.${currentBuild.number}"
          sh label: 'npm install', script: 'npm install'
          sh label: 'lerna bootstrap', script: 'npx lerna bootstrap'
          sh label: 'npm run build', script: 'npm run build'
          sh label: 'publish', script: """
          mkdir -p "${WORKSPACE}/publish"
          cp "${WORKSPACE}/src/packages/evm/Dockerfile-jenkins-linux" "${WORKSPACE}/publish/Dockerfile"
          cp -R "${WORKSPACE}/src/packages/evm/build-qa" "${WORKSPACE}/publish/evm"
          """
        }
      }
    }
    stage('SonarQube analysis') {
      agent {
        docker {
          image 'sonarsource/sonar-scanner-cli:latest'
          label 'docker&&linux'
          args '-v /var/lib/git-mirror:/var/lib/git-mirror'
          reuseNode true
        }
      }
      environment {
        HOME = "${WORKSPACE}"
      }
      steps {
        dir('src') {
          withSonarQubeEnv('Sonarqube') {
            sh """
            sonar-scanner \
              -Dsonar.projectKey="Crossbones-WebUI" \
              -Dsonar.projectVersion="${currentBuild.displayName}"
            """.stripIndent().trim()
          }
        }
      }
    }
    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'HOURS') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
    stage('Docker image') {
      steps {
        dir('publish') {
          script {
            def dockerImageName = scm.branches[0].name.replaceAll('^origin/', '').toLowerCase().replaceAll('[^a-z0-9]', '-').replaceAll('-+', '-').replaceAll('(^-+|-+$)', '')
            docker.withRegistry(env.NEXUS_DOCKER_HOSTED_URL, 'nexus-jenkins') {
              def image = docker.build("crossbones-webui-${dockerImageName}:${currentBuild.displayName}")
              image.push(currentBuild.displayName)
              image.push('latest')
            }
            zip archive: true, dir: '', exclude: '', glob: 'evm/**', zipFile: 'evm.zip'
          }
        }
      }
    }
  }
}
