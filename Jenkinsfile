
pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Nadeeshasanjaya/Self-Healing-Infrastructure-Dashboard.git'
            }
        }


        stage('Build Backend') {
            steps {
                dir('Self-Healing-Infrastructure-Dashboard-Backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Self-Healing Infrastructure Dashboard') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t nadeesha1/self-healing-dashboard:backend ./Self-Healing-Infrastructure-Dashboard-Backend

                    docker build -t nadeesha1/self-healing-dashboard:frontend "./Self-Healing Infrastructure Dashboard"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                    docker push nadeesha1/self-healing-dashboard:backend
                    docker push nadeesha1/self-healing-dashboard:frontend
                '''
            }
        }
    }
}

