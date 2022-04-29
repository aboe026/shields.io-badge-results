@Library('aboe026') _ // groovylint-disable-line VariableName, UnusedVariable

node {
    def packageJson
    def workDir = "${WORKSPACE}/${env.BRANCH_NAME}-${env.BUILD_ID}"
    def nodeImage = 'node:16'
    def version
    def exceptionThrown = false
    def badges = new ShieldsIoBadges(this, 'shields.io-badge-results')
    def uploadBadges = env.BRANCH_NAME == 'main'

    try {
        ansiColor('xterm') {
            dir(workDir) {
                stage('Pull Runtime Image') {
                    sh "docker pull ${nodeImage}"
                }

                docker.image(nodeImage).inside {
                    parallel(
                        'env': {
                            stage('Runtime Versions') {
                                sh 'node --version'
                                sh 'npm --version'
                            }
                        },
                        'proj': {
                            stage('Checkout') {
                                checkout scm
                            }

                            stage('Install') {
                                sh 'npm ci'
                            }
                        }
                    )

                    stage('Set Build Number') {
                        packageJson = readJSON file: 'package.json'
                        version = "${packageJson.version}+${env.BUILD_ID}"
                        currentBuild.displayName = version
                    }

                    stage('Lint') {
                        sh 'npm run lint'
                    }

                    stage('Validate Results') {
                        sh 'npm run validate:results'
                    }

                    stage('Unit Tests') {
                        try {
                            sh 'npm run test:unit:xml'
                        } catch (err) {
                            exceptionThrown = true
                            println 'Exception was caught in try block of unit tests stage.'
                            println err
                        } finally {
                            junit testResults: 'test-results/unit.xml', allowEmptyResults: true
                            cobertura coberturaReportFile: 'coverage/unit/cobertura-coverage.xml'
                            if (uploadBadges) {
                                badges.uploadCoberturaCoverageResult(
                                    branch: env.BRANCH_NAME
                                )
                            }
                        }
                    }

                    stage('E2E Tests') {
                        try {
                            sh 'npm run test:e2e:xml'
                        } catch (err) {
                            exceptionThrown = true
                            println 'Exception was caught in try block of e2e tests stage.'
                            println err
                        } finally {
                            junit testResults: 'test-results/e2e.xml', allowEmptyResults: true
                            def e2eDebugLogs = 'test/e2e/.temp-work-dir/e2e-debug.txt'
                            if (fileExists(e2eDebugLogs)) {
                                archiveArtifacts artifacts: e2eDebugLogs
                            }
                        }
                    }
                }
            }
        }
    } catch (err) {
        exceptionThrown = true
        println 'Exception was caught in try block of jenkins job.'
        println err
    } finally {
        if (uploadBadges) {
            badges.uploadBuildResult(
                branch: env.BRANCH_NAME
            )
        }
        stage('Cleanup') {
            try {
                sh "rm -rf ${workDir}"
            } catch (err) {
                println 'Exception deleting working directory'
                println err
            }
            try {
                sh "rm -rf ${workDir}@tmp"
            } catch (err) {
                println 'Exception deleting temporary working directory'
                println err
            }
            if (exceptionThrown) {
                error('Exception was thrown earlier')
            }
        }
    }
}
