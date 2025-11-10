pipeline {
  agent any

  options {
    ansiColor('xterm')
    timestamps()
  }

  parameters {
    choice(
      name: 'DEPLOY_TARGET',
      choices: ['none', 'uat', 'prod', 'both'],
      description: 'Select which environment(s) to deploy after pushing images.'
    )
  }

  environment {
    REGISTRY_HOST = 'registry.example.com'
    REGISTRY_NAMESPACE = 'hr-cms'
    API_IMAGE = "${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/api"
    WEB_IMAGE = "${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/web"
    UAT_DOCKER_CONTEXT = 'uat'
    PROD_DOCKER_CONTEXT = 'prod'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Determine Image Tag') {
      steps {
        script {
          env.IMAGE_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        }
      }
    }

    stage('Build API Image') {
      steps {
        sh '''
          set -euo pipefail
          docker build -f docker/api.Dockerfile -t ${API_IMAGE}:${IMAGE_TAG} .
        '''
      }
    }

    stage('Build Web Image') {
      steps {
        sh '''
          set -euo pipefail
          docker build \
            --build-arg VITE_API_URL=/api \
            -f docker/web.Dockerfile \
            -t ${WEB_IMAGE}:${IMAGE_TAG} .
        '''
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'docker-registry',
            usernameVariable: 'REGISTRY_USER',
            passwordVariable: 'REGISTRY_PASSWORD'
          )
        ]) {
          sh '''
            set -euo pipefail
            echo "$REGISTRY_PASSWORD" | docker login ${REGISTRY_HOST} --username "$REGISTRY_USER" --password-stdin
            docker push ${API_IMAGE}:${IMAGE_TAG}
            docker push ${WEB_IMAGE}:${IMAGE_TAG}
          '''
        }
      }
    }

    stage('Deploy UAT') {
      when {
        expression { params.DEPLOY_TARGET in ['uat', 'both'] }
      }
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'docker-registry',
            usernameVariable: 'REGISTRY_USER',
            passwordVariable: 'REGISTRY_PASSWORD'
          ),
          file(credentialsId: 'uat-stack-env', variable: 'UAT_STACK_ENV'),
          file(credentialsId: 'uat-api-env', variable: 'UAT_API_ENV')
        ]) {
          sh '''
            set -euo pipefail
            cp "$UAT_STACK_ENV" deploy/uat/stack.env
            cp "$UAT_API_ENV" deploy/uat/api.env
            {
              echo "REGISTRY_HOST=${REGISTRY_HOST}"
              echo "REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE}"
              echo "IMAGE_TAG=${IMAGE_TAG}"
            } >> deploy/uat/stack.env

            echo "$REGISTRY_PASSWORD" | docker --context ${UAT_DOCKER_CONTEXT} login ${REGISTRY_HOST} --username "$REGISTRY_USER" --password-stdin
            docker --context ${UAT_DOCKER_CONTEXT} compose \
              -f deploy/uat/docker-compose.yml \
              --env-file deploy/uat/stack.env \
              pull
            docker --context ${UAT_DOCKER_CONTEXT} compose \
              -f deploy/uat/docker-compose.yml \
              --env-file deploy/uat/stack.env \
              up -d
          '''
        }
      }
    }

    stage('Deploy Prod') {
      when {
        expression { params.DEPLOY_TARGET in ['prod', 'both'] }
      }
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'docker-registry',
            usernameVariable: 'REGISTRY_USER',
            passwordVariable: 'REGISTRY_PASSWORD'
          ),
          file(credentialsId: 'prod-stack-env', variable: 'PROD_STACK_ENV'),
          file(credentialsId: 'prod-api-env', variable: 'PROD_API_ENV')
        ]) {
          sh '''
            set -euo pipefail
            cp "$PROD_STACK_ENV" deploy/prod/stack.env
            cp "$PROD_API_ENV" deploy/prod/api.env
            {
              echo "REGISTRY_HOST=${REGISTRY_HOST}"
              echo "REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE}"
              echo "IMAGE_TAG=${IMAGE_TAG}"
            } >> deploy/prod/stack.env

            echo "$REGISTRY_PASSWORD" | docker --context ${PROD_DOCKER_CONTEXT} login ${REGISTRY_HOST} --username "$REGISTRY_USER" --password-stdin
            docker --context ${PROD_DOCKER_CONTEXT} compose \
              -f deploy/prod/docker-compose.yml \
              --env-file deploy/prod/stack.env \
              pull
            docker --context ${PROD_DOCKER_CONTEXT} compose \
              -f deploy/prod/docker-compose.yml \
              --env-file deploy/prod/stack.env \
              up -d
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'rm -f deploy/uat/stack.env deploy/uat/api.env deploy/prod/stack.env deploy/prod/api.env'
    }
  }
}
