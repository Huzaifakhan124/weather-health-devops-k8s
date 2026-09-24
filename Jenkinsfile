pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'huziafakhan/weather-health-app'
        TAG = 'latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    // path
                    sh "docker build -t ${DOCKER_IMAGE}:${TAG} ./src"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Pushing Docker image to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_IMAGE}:${TAG}"
                    }
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                script {
                    echo 'Updating Kubernetes deployment manifest in GitHub...'
                    withCredentials([gitUsernamePassword(credentialsId: 'github-credentials', gitToolName: 'Default')]) {
                        sh '''
                            git config --global user.email "jenkins@example.com"
                            git config --global user.name "Jenkins CI"
                            
                            // Force deployment.yaml to update so ArgoCD triggers sync
                            sed -i "s|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${TAG}|g" k8s/deployment.yaml
                            
                            git add k8s/deployment.yaml
                            git commit -m "ci: update image tag via Jenkins build #${BUILD_NUMBER}" || echo "No changes to commit"
                            git push origin main
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline successfully complete !'
        }
        failure {
            echo 'error in the pipeline.'
        }
    }
}