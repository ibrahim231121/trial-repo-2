GIT_COMMIT = ''

pipeline {
  agent {
    label 'frontend'
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
              [$class: 'CloneOption', noTags: false, reference: '/var/lib/git-mirror/evm4-ui-alpr', shallow: false],
              [$class: 'LocalBranch', localBranch: scm.branches[0].name.replaceAll('^origin/', '')],
              [$class: 'RelativeTargetDirectory', relativeTargetDir: 'src'],
              [$class: 'CleanCheckout']
            ],
            submoduleCfg: [],
            userRemoteConfigs: [
              [credentialsId: 'ssh-jenkins', url: 'git@bitbucket.org:irsavideo/evm4-ui-alpr.git']
            ]
          ]).GIT_COMMIT
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
      environment {
        HOME = "${WORKSPACE}"
        NODE_ENV = 'test'
      }
      steps {
        dir('publish') {
          deleteDir()
        }
        dir('src') {
          buildName "1.0.${currentBuild.number}"
          sh label: 'createa version file', script: "echo export const buildVersionNumber = '1.0.${currentBuild.number}' > packages/evm/src/version.ts"
          sh label: 'createa version file', script: """
          echo "export const buildVersionNumber = '1.0.${currentBuild.number}'" > packages/evm/src/version.ts
          """
          sh label: 'check the version file', script: 'cat packages/evm/src/version.ts' 
          sh label: 'yarn install', script: 'yarn install'
          // sh label: 'npm install', script: 'npm install'
          sh label: 'lerna bootstrap', script: 'npx lerna bootstrap'
          sh label: 'yarn run build', script: 'yarn run build'
          sh label: 'publish', script: """
          mkdir -p "${WORKSPACE}/publish"
          cp "${WORKSPACE}/src/packages/evm/Dockerfile-jenkins-linux" "${WORKSPACE}/publish/Dockerfile"
          cp -R "${WORKSPACE}/src/packages/evm/build" "${WORKSPACE}/publish/evm"
          """
        }
      }
    }
    stage('SonarQube analysis') {
      agent {
        docker {
          image 'sonarsource/sonar-scanner-cli:latest'
          label 'frontend'
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
              -Dsonar.projectKey="evm4-ui-alpr" \
              -Dsonar.projectVersion="${currentBuild.displayName}"
            """.stripIndent().trim()
          }
          deleteDir()
        }
      }
    }
    stage('Quality Gate') {
      when {
        branch 'development'
      }    
      steps {
        timeout(time: 1, unit: 'HOURS') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
    stage('Docker image') {
      when {
         expression { env.CHANGE_ID == null }
      }    
      steps {
        dir('publish') {
          script {
            def dockerImageName = scm.branches[0].name.replaceAll('^origin/', '').toLowerCase().replaceAll('[^a-z0-9]', '-').replaceAll('-+', '-').replaceAll('(^-+|-+$)', '')
            def image = docker.build("evm4-ui-alpr-${dockerImageName}:${currentBuild.displayName}")
            docker.withRegistry(env.NEXUS_DOCKER_HOSTED_URL, 'nexus-jenkins') {
              image.push(currentBuild.displayName)
              image.push('latest')
            }
            docker.withRegistry(env.AZURE_CONTAINER_REGISTRY_URL, 'azure-cr-service-principal-userpass') {
              image.push(currentBuild.displayName)
              image.push('latest')
            }
            zip archive: true, dir: '', exclude: '', glob: 'evm/**', zipFile: "evm4-ui-alpr${currentBuild.displayName}.zip"
          }
        }
      }
    }
  }
  post {
    always {
      cleanWs(cleanWhenNotBuilt: false,
              deleteDirs: true,
              disableDeferredWipeout: true,
              notFailBuild: true,
              patterns: [
                [pattern: '.cache/**', type: 'INCLUDE'],
                [pattern: '.npm/**', type: 'INCLUDE'],
                [pattern: '**/node_modules/**', type: 'INCLUDE'],
                [pattern: '**/evm/**', type: 'INCLUDE']                
              ])

    }

  }
}
