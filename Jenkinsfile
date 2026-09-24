pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'huziafakhan/weather-health-app'
        TAG = "${env.BUILD_NUMBER}"
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
                    echo "Building Docker image with tag ${TAG}..."
                    sh "docker build -t ${DOCKER_IMAGE}:${TAG} -t ${DOCKER_IMAGE}:latest ./src"
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
                        sh "docker push ${DOCKER_IMAGE}:latest"
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
                            
                            # Fetch and pull latest changes to avoid non-fast-forward errors
                            git remote set-url origin https://github.com/Huzaifakhan124/weather-health-devops-k8s.git
                            git fetch origin main
                            git checkout main || git checkout -b main
                            git pull origin main --rebase
                            
                            # Update deployment.yaml with the new unique build tag
                            sed -i "s|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${TAG}|g" k8s/deployment.yaml
                            
                            git add k8s/deployment.yaml
                            git commit -m "ci: update image tag to ${TAG} via Jenkins build #${BUILD_NUMBER}" || echo "No changes to commit"
                            git push origin main
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline successfully complete with unique version tag!'
        }
        failure {
            echo 'error in the pipeline.'
        }
    }
}