pipeline {
    agent any
    stages {
        stage('Job Init'){
            steps{ 
                echo "$JOB_NAME"
                echo "TimeStamp: ${currentBuild.startTimeInMillis}"
                sh 'mkdir -p /var/jenkins_home/kube'
                // Final required output is kubectl -n default patch deployment carecoordination-servicedeployment -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
                sh 'echo "KUBECONFIG=/var/jenkins_home/kube/config kubectl -n default patch deployment hello-world -p \\"{\\\\\\"spec\\\\\\":{\\\\\\"template\\\\\\":{\\\\\\"metadata\\\\\\":{\\\\\\"labels\\\\\\":{\\\\\\"date\\\\\\":\\\\\\"`date +\'%s\'`\\\\\\"}}}}}\\"" > /var/jenkins_home/kube/patch.sh'
                sh 'chmod a+x /var/jenkins_home/kube/patch.sh'
                sh 'ls -lrt /var/jenkins_home/kube/patch.sh'
                sh 'cat /var/jenkins_home/kube/patch.sh'
                //echo "TimeStamp: ${Util.getTimeSpanString(System.currentTimeMillis())}"
            }
        }
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[credentialsId: 'Github_credentials', url: 'https://github.com/Suryaobulareddy/hello-world-webserver.git']]])
            }
        }
        stage('Build docker Image'){
            steps{
                sh 'docker build --tag suryaobulareddy2932/hello-world:latest -f /var/jenkins_home/workspace/docker-test/Dockerfile .'
            }
        }
        stage('Docker push'){
            steps{
               withCredentials([string(credentialsId: 'dockerhub_secretkey', variable: 'dockerhub_secretkey')]) {
                    // some block
                    sh 'docker login -u suryaobulareddy2932 -p ${dockerhub_secretkey}'
               }
               sh 'docker push suryaobulareddy2932/hello-world:latest'
            }
        }
        
        stage('Deploy to K8S Cluster'){
            steps{
                //sh 'export KUBECONFIG=/var/jenkins_home/kube/config'
                // sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl get pods'
                // sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl get svc'
                // sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl delete -f hello-world.yaml'
                
                
                sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl get pods'
                sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl get svc'
                sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl apply -f hello-world.yaml --record=true'
                
                sh 'sh /var/jenkins_home/kube/patch.sh'
                
                sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl get pods'
                sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl get svc'
                //sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl -n default patch deployment surya-jenkins-docker'
                //sh 'kubectl -n default patch deployment carecoordination-servicedeployment -p  \'{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}\''
                //sh 'KUBECONFIG=/var/jenkins_home/kube/config kubectl -n default patch deployment hello-world -p "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"${currentBuild.startTimeInMillis}\"}}}}}"'
                /*kubernetesDeploy(
                    enableConfigSubstitution: true,
                    configs:'hello-world.yaml',
                    kubeconfigId: 'kube_config'
                    )
                    */
                
            }
        }        
    }
    post {
         success {
            mail bcc: 'suryaobulareddy@gmail.com', body: "Dear Team,\n\nThis mail is from Jenkins Pipeline, Here is job info: \n${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}", cc: 'surya.obulareddy@celllabs.com', from: '', replyTo: '', subject: "Jenkins Pipeline :: ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} - ${currentBuild.currentResult}!", to: 'surya.obulareddy@celllabs.com'
            //emailext body: 'A Test EMail', recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], subject: 'Test'
        }
        failure{
            emailext body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}",
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                //subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
            subject: "Jenkins Pipeline :: ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} - ${currentBuild.currentResult}!"
        }
    }
//      post {
//         always {
//             emailext body: 'A Test EMail', recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']], subject: 'Test'
//         }
//     }
}
