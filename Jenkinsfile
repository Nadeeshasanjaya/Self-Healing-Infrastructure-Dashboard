pipeline {

    agent any

       stages {
        stage('Checkout') {
            steps {
                git.branch('main'),
                url('https://github.com/Nadeeshasanjaya/Self-Healing-Infrastructure-Dashboard.git')
            }
        }

        stage('Build backend ') {
            steps {
                dir('Self-Healing-Infrastructure-Dashboard-Backend') {
                    sh 'mvn clean package -DskipTests'
                }
                
            }
        }
        stage('Build frontend  ') {
            steps {
                dir('Self-Healing-Infrastructure-Dashboard-Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                    
                }
                
            }
        }
        stage('build image') {
            steps {
                sh ''''
                    docker build -t nadeesha1/self-healing-backend:latest ./Self-Healing-Infrastructure-Dashboard-Backend

                    docker build -t nadeesha1/self-healing-frontend:latest ./Self-Healing-Infrastructure-Dashboard-Frontend
                '''
            }
        }
        stage('push to docker hub') {
            steps {
                sh '''
                    docker push nadeesha1/self-healing-backend:latest
                    docker push nadeesha1/self-healing-frontend:latest
                '''
            }
        }





}