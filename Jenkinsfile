
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
                sh '''
                    docker push nadeesha1/self-healing-dashboard:backend
                    docker push nadeesha1/self-healing-dashboard:frontend
                '''
            }
        }
       stage('Deploy to EC2') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'aws-jenkins',
            usernameVariable: 'AWS_ACCESS_KEY_ID',
            passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        )]) {
            sshagent(['ec2-self-healing']) {
                sh '''
                    EC2_IP=$(aws ec2 describe-instances \
    --region ap-south-1 \
    --instance-ids i-06ebd4293b71ed358 \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

                    echo "Current EC2 IP: $EC2_IP"

                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP "
                        cd ~/self-healing &&
                        sudo docker compose pull &&
                        sudo docker compose up -d
                    "
                '''
            }
        }
    }
}
    }
}

