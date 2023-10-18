@Library('adp-shared-library@1.21.1') _

// General Imports
// Use @Field Annotation for global variables which are initially undefined, but are assigned and used later
import groovy.transform.Field

// Shared Library Imports
import adp.util.Util
import adp.azure.Azure
import adp.kubernetes.Kubernetes

Util util = new Util(this)
Azure azure = new Azure(this)
Kubernetes kubernetes = new Kubernetes(this)


env.baseContainerRegistry = 'adpbaseimages001'
env.acrSecret = 'acr-secret'
env.projectName = 'ecm-app-frontend'

boolean isDeployment = false
boolean isMain = util.isMain()
boolean isNightly = util.isStartedByTimer()
String buildBase = util.isMain() ? 'HEAD~1' : 'origin/main'
String sanitizedBranchName = util.getSanitizedBranchName(env.BRANCH_NAME)

@Field
String version
@Field
String imageName
@Field
String persistentImageName



// function used for loading environment files
def loadEnvironmentVariables() {

    environmentFilePath = './environment/privsc-d-001-ecmd.yaml'

    // Initialize environment variables depending on the branch:
    if ("${BRANCH_NAME}" ==~ /^quality/) {
        environmentFilePath = './environment/privsc-q-001-ecmq.yaml'
    } else if ("${BRANCH_NAME}" ==~ /^production/) {
        environmentFilePath = './environment/privsc-p-001-ecmp.yaml'
    }

    echo "Loading clusterEnvs from path: ${environmentFilePath}"
    readYaml file: environmentFilePath
}


def defineImageNames(sanitizedBranchName) {
    version = getVersion()

    imageName           = "${clusterEnvs.container_registry}/${clusterEnvs.namespace_name_short}/${clusterEnvs.container_registry_repository}:${sanitizedBranchName}.${env.BUILD_ID}".toLowerCase()
    persistentImageName = "${clusterEnvs.container_registry}/${clusterEnvs.namespace_name_short}/${clusterEnvs.container_registry_repository}:${version}-${env.BUILD_ID}".toLowerCase()
}

String getVersion() {
    def packageJSON = readJSON file: 'package.json'

    return packageJSON.version
}

String getAdditionalCommandArgs(isNightly, buildBase) {
    return (params.BUILD_ALL_PROJECTS || isNightly) ? '' : "--base=${buildBase}"
}

String getAllCommandArgs(isNightly, buildBase) {
    return (params.BUILD_ALL_PROJECTS || isNightly) ? true : false
}

def loadDeploymentYaml() {
    readYaml file: 'Deployment.yaml'
}



//what branch should be used as a baseline (i.e. for checks)?
baselineBranch = util.isPullRequest() ? env.CHANGE_TARGET : sanitizedBranchName

//the path including folders where the project is found in Jenkins.
projectPath = env.JOB_NAME.split(env.JOB_BASE_NAME)[0]

//build should be unstable if any issues are found in a current branch. In a PR, it should be red if new issues are introduced.
qualityGate = util.isPullRequest() ? [threshold: 1, type: 'NEW', unstable: false] : [threshold: 1, type: 'TOTAL', unstable: true]


// set environment variable for build state
buildEnvironment = 'dev'

// Initialize environment variables depending on the branch:
if ("${BRANCH_NAME}" ==~ /^main/) {
    buildEnvironment = 'dev'
    // deploy on DEV
    isDeployment = true

} else if ("${BRANCH_NAME}" ==~ /^quality/) {
    // deploy on QAS
    buildEnvironment = 'qas'
    isDeployment = true

}else if ("${BRANCH_NAME}" ==~ /^production/) {
        // deploy on PRD
    buildEnvironment = 'prod'
    isDeployment = true
}




pipeline {
    parameters {
        // Tag for using an alternative image tag, e.g. build image testing
        // can be removed, but replace "+ params.BUILD_IMAGE_TAG" with "1" when defining the docker image
        string name: 'BUILD_IMAGE_TAG', defaultValue: '1', description: 'Tag of used Jenkins build base image', trim: true
        // This param can be used to build all projects in the workspace
        booleanParam name: 'BUILD_ALL_PROJECTS', defaultValue: true, description: 'Set to true to build all projects, even if they are not affected by changes.'
        // Deployment always depends on the flag AKS_DEPLOYMENT
        // The default is true for main and false for all other branches.
        booleanParam name: 'AKS_DEPLOYMENT', defaultValue: isMain, description: 'If ticked, deploy the result of this build to the Shared Cluster.'
    }

    agent {
        docker {
            // use the latest version of our base jenkins build image. If you have special requirements, you can also use a specific 1.<VER> version, e.g. 1.1
            image 'artifactory.schaeffler.com/docker/adp/jenkinsbaseimage:' + params.BUILD_IMAGE_TAG
            label 'adp-docker-internal'
            // Enforce the pull of newer versions of jenkinsbaseimage
            alwaysPull true
            args '-u root:root -v $HOME/.cache/Cypress:$HOME/.cache/Cypress -v /var/run/docker.sock:/var/run/docker.sock -e https_proxy -e http_proxy -e no_proxy'
        }
    }

     options {
        // specify the number of builds to be stored in the history (default is 20)
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // disable multiple build jobs of this pipeline at the same time, let newer jobs cancel running ones of the same PR/branch
        disableConcurrentBuilds(abortPrevious: true)
        // abort the build afert one hour
        timeout(time: 1, unit: 'HOURS')
        // extend all console outputs with a timestamp
        timestamps()
        // use xterm formatting for console output
        ansiColor('xterm')
    }

    triggers {
        // run at midnight for nightly builds
        cron('@midnight')
    }

    environment {
        NX_BRANCH = env.BRANCH_NAME.replace('PR-', '')
        ADDITIONAL_COMMAND_ARGS = getAdditionalCommandArgs(isNightly, buildBase)
        ALL_COMMAND_ARGS = getAllCommandArgs(isNightly, buildBase)
    }

    stages {
        stage('Preparation') {
            steps {
                script {
                    discoverGitReferenceBuild referenceJob: projectPath + baselineBranch
                    clusterEnvs = loadEnvironmentVariables()

                    defineImageNames(sanitizedBranchName)

                    util.addWorkspaceToGitGlobalSafeDirectory()

                    // install node_modules with pnpm
                    sh 'pnpm install'
                }
            }
        }

        stage('Format Check') {
           when {
                expression {
                    return !isNightly
                }
            }
            steps {
                script {
                    if (env.ALL_COMMAND_ARGS) {
                        sh "pnpm nx format:check --all"
                    }
                    else {
                        sh "pnpm nx format:check ${env.ADDITIONAL_COMMAND_ARGS}"
                    }                    
                }
            }
        }

        stage('Lint') {
            steps {
                script {
                    // Run Workspace Lint to verify that all Nx and Angular Config Files are valid
                    sh 'pnpm nx workspace-lint'

                    if (env.ALL_COMMAND_ARGS) {
                        sh "pnpm nx run-many --target=lint --configuration=ci"
                    }
                    else {
                        sh "pnpm nx affected --target=lint --configuration=ci ${env.ADDITIONAL_COMMAND_ARGS}"
                    }    
                    // Run EsLint to check your code against certain rules to avoid bad practices and a unhealthy code base
                    //sh "pnpm nx ${env.PRE_COMMAND_ARGS} affected --target=lint --configuration=ci ${env.ADDITIONAL_COMMAND_ARGS}"
                }
            }
            post {
                always {
                    recordIssues(ignoreQualityGate: util.isPullRequest(), qualityGates: [qualityGate], tools: [esLint(pattern: 'checkstyle/**/checkstyle.xml')], enabledForFailure: true)
                }
            }
        }

        stage('Unit Tests') {
            when {
                expression {
                    return false
                    // return !isNightly && !params.MANUAL_DEPLOYMENT
                }
            }
            steps {
                script {
                    sh "pnpm nx affected --base=${buildBase} --target=test"
                }
            }
            post {
                success {
                    // Unit tests results
                    publishCoverage adapters: [istanbulCoberturaAdapter(mergeToOneReport: true, path: 'coverage/**/*cobertura-coverage.xml')], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                }
                always {
                    junit allowEmptyResults: true, testResults: 'coverage/junit/test-*.xml'
                }
            }
        }

        stage('E2E Tests') {
            when {
                expression {
                    return false
                    // return !isNightly && !params.MANUAL_DEPLOYMENT
                }
            }
            steps {
                script {
                    sh "pnpm nx affected --base=${buildBase} --target=e2e"
                }
            }
            post {
                always {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/cypress/**/*.mp4', followSymlinks: false
                }
            }
        }

         stage('Build') {
            when {
                expression {
                    return !isNightly
                }
            }
            steps {
                script {
                    if (env.ALL_COMMAND_ARGS) {
                        sh "pnpm nx run-many --target=build --configuration=${buildEnvironment}"
                    }
                    else {
                        sh "pnpm nx affected --target=build ${env.ADDITIONAL_COMMAND_ARGS} --configuration=${buildEnvironment}"
                    }    
                    //sh "pnpm nx ${env.PRE_COMMAND_ARGS} affected --target=build ${env.ADDITIONAL_COMMAND_ARGS} --configuration=${buildEnvironment}"
                }
            }
        }

        stage('Dockerize') {
            when {
                expression {
                    return !isNightly
                }
            }
            steps {
                // login to azure using credentials set in the environment file
                // login to container registry
                // build a new docker image out of the base image specified in the dockerfile adding just the build artifact
                script {
                    azure.login(clusterEnvs.az_service_principal)
                    sh """#!/bin/bash -ex
                        set +x;
                        az acr login -n ${baseContainerRegistry}
                        docker build --pull -t ${imageName} -t ${persistentImageName} .
                    """

                    // Login to ACR by using the Name of the Scope Token as Username and its content as its password
                    withCredentials([string(credentialsId: "acr-token-${clusterEnvs.namespace_name_short}", variable: 'ACR_TOKEN_PASSWORD')]) {
                        sh "echo ${ACR_TOKEN_PASSWORD} | docker login --username acr-token-${clusterEnvs.namespace_name_short} --password-stdin ${clusterEnvs.container_registry}"
                        sh "docker push ${imageName}"
                    }
                }
            }
        }
       
        stage('AKS Deployment') {
            when {
                expression {
                    return isDeployment && !isNightly
                }
            }
            steps {
                // login to azure using credentials set in the environment file
                // login to kubectl with aks get-credentials as SP and kubelogin to perform non-interactive login
                // replace the container registry secret and build id in the deployment.yaml and apply it
                // perform a rollout restart -> redeploy the application without a downtime
                script {
                    azure.login(clusterEnvs.az_service_principal)
                    azure.setSubscription(clusterEnvs.cluster_subscription)
                    kubernetes.setupKubeconfig(clusterEnvs.az_service_principal, clusterEnvs.cluster_name, clusterEnvs.cluster_resource_group, clusterEnvs.cluster_subscription, clusterEnvs.namespace)
                    sh """#!/bin/bash -ex
                        set +x;

                        cat Deployment.yaml |
                        sed "s#IMAGE_NAME#${imageName}#g" |
                        kubectl apply -f -
                        kubectl rollout restart deployment ${loadDeploymentYaml().metadata.name[0]} -n ${clusterEnvs.namespace}

                        kubectl rollout status deployment ${loadDeploymentYaml().metadata.name[0]} --timeout=300s
                    """
                }
            }
        }

        stage('Nightly Dependency Checks') {
            when {
                // runs only when the expression evaluates to true
                expression {
                    // will return true when the build runs via cron trigger e.g. for nightly builds
                    return isNightly
                }
            }
            steps {
                script {
                    def result = sh(returnStatus: true, script: '''
                        mkdir -p reports
                        pnpm audit --json > reports/pnpm-audit.json
                    ''') as int

                    recordIssues tool: analysisParser(pattern: 'reports/pnpm-audit.json', analysisModelId: 'pnpm-audit')

                    if (result != 0) {
                        unstable 'PNPM audit failed'
                    }
                }
            }
        }
    }
    post {
        always {
            // perform general clean up
            cleanWs(deleteDirs: true)
        }
    }
}