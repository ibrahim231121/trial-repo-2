GIT_COMMIT = ''

pipeline {
  agent any

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
  }
}
