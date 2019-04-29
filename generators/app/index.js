const chalk = require('chalk');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const packagejs = require('../../package.json')
const utilYaml = require('./utilYaml.js');

const FIREBASE = 'Firebase';
const DEAULT_FIREBASE_TYPE = 'fcm';
const DEFAULT_FIREBASE_SERVER_KEY = '1234bcnxbc';
const DEAULT_FIREBASE_API_URL = 'https://fcm.googleapis.com/fcm/send';

module.exports= class extends BaseGenerator{
    get initializing(){
      return {
          init(args){
             if (args === 'default'){
                 this.defaultOptions=true;
             }
          },

          readConfig(){
              this.jhipsterAppConfig = this.getAllJhipsterConfig();
              if (!this.jhipsterAppConfig){
                  this.error('Can\'t read .yo-rc.json');
              }
          },

          displayLogo() {
              // Have Yeoman greet the user.
              this.log('');
              this.log(`${chalk.white('  ██████  ██████  ██████  ██████  ')}${chalk.red(' ██████    ██    ███████  ██████')}`);
              this.log(`${chalk.white('  ██        ██    ██  ██  ██      ')}${chalk.red(' █   ██   ████   ██       ██    ')}`);
              this.log(`${chalk.white('  ██████    ██    █████   ████    ')}${chalk.red(' ████    █    █  ███████  ████  ')}`);
              this.log(`${chalk.white('  ██        ██    ██  ██  ██      ')}${chalk.red(' █   ██  █ ██ █       ██  ██    ')}`);
              this.log(`${chalk.white('  ██      ██████  ██  ██  ██████  ')}${chalk.red(' ██████  █    █  ███████  ██████')}`);
              this.log(`${chalk.white('                                  ')}${chalk.red('                                ')}`);
              this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster Firebase')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
          },

          checkJhipster() {
              const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
              const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
              if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                  this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
              }
          },
      };
    }


    prompting(){
        const done = this.async();

        const prompts = [{
            type:'list',
            name:'firebase',
            message:`Which ${chalk.yellow('*type*')} of  would you like to add?`,
            choices:[
                {
                    value:FCM,
                    name:'Firebase Cloud Messaging'
                },
            ],
            store: true,
            default:DEFAULT_FIREBASE_TYPE
        },
            {
                when: response => response.firebase === FCM,
                type: 'input',
                name:'firebaseServerKey',
                message:'Please enter your Firebase server key...',
                default:DEFAULT_FIREBASE_SERVER_KEY,
                store:true
            },

            { when: response => response.firebase === FCM,
                type: 'input',
                name:'firebaseApiURL',
                message:'Please enter your Firebase API URL...',
                default:DEFAULT_FIREBASE_SERVER_KEY,
                store:true


            }];
        if (this.defaultOptions){
            this.firebase = DEAULT_FIREBASE_TYPE;
            this.firebaseServerKey = DEFAULT_FIREBASE_SERVER_KEY;
            this.firebaseApiURL = DEAULT_FIREBASE_API_URL;
            done();
        }else{
            this.prompt(prompts).then((props) => {
                this.props = this.props;
                //variable from questions
                this.firebase = this.props.firebase;
                if(this.props.firebase === FCM){
                    this.firebaseServerKey = this.props.firebaseServerKey;
                    this.firebaseApiURL =this.props.firebaseApiURL;
                }
                done();
            });
        }




    }

    writing(){
       //this function use directly the template
        this.template = function (source,destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.templatePath(destination),
                this
            );

        };

        switch (this.firebase){
            case FCM:
                this.installFCM();
                break;
            case RealtimeDatabase:
                this.installRealtimeDatabase();
                break;
            default:
                break;

        }

    }
    installFCM() {
        const FIREBASE_ADMIN_VERSION = '6.8.0';
        const JSON_DEPENDENCY_VERSION = '20160810';

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;


        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        // add dependencies
        if (this.buildTool === 'maven') {

                this.addMavenDependency('com.google.firebase', 'firebase-admin',  FIREBASE_ADMIN_VERSION);
                this.addMavenDependency('org.json', 'json', JSON_DEPENDENCY_VERSION);

        } else if (this.buildTool === 'gradle') {

                this.addGradleDependency('compile', 'com.google.firebase', 'firebase-admin', '6.0.0');
                this.addGradleDependency('compile', 'org.json', 'json', JSON_DEPENDENCY_VERSION);
            }


        // add Java classes
        this.template('src/main/java/package/domain/_FirebaseAuthenticationToken.java', `${javaDir}domain/FirebaseAuthenticationToken.java`);
        this.template('src/main/java/package/domain/_FirebaseUserDetails.java', `${javaDir}domain/FirebaseUserDetails.java`);
        this.template('src/main/java/package/service/_AndroidPushNotificationsService.java', `${javaDir}service/stream/AndroidPushNotificationsService.java`);
        this.template('src/main/java/package/service/_HeaderRequestInterceptor.java', `${javaDir}service/stream/HeaderRequestInterceptor.java`);
        this.template('src/main/java/package/web/rest/_WebController.java', `${javaDir}web/rest/WebController.java`);

        this.template('src/main/java/package/config/_FirebaseAuthenticationProvider.java', `${javaDir}config/FirebaseAuthenticationProvider.java`);
        this.template('src/main/java/package/config/_FirebaseAuthenticationTokenFilter.java', `${javaDir}config/FirebaseAuthenticationTokenFilter.java`);
        this.template('src/main/java/package/config/_FirebaseConfig.java', `${javaDir}config/FirebaseConfig.java`);
        this.template('src/main/java/package/config/_WebSecurityConfig.java', `${javaDir}config/WebSecurityConfig.java`);
        this.template('src/main/java/package/resources/my-project.json', `${resourceDir}resources/my-project.json` );

        // application-dev.yml
        const yamlAppDevProperties = { };
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.default.contentType', this, 'application/json');
        utilYaml.updatePropertyInArray(yamlAppDevProperties, 'spring.cloud.stream.bindings.input.destination', this, 'topic-jhipster');

        // application-prod.yml
        const yamlAppProdProperties = yamlAppDevProperties;

        utilYaml.updateYamlProperties(`${resourceDir}config/application-prod.yml`, yamlAppProdProperties, this);
    }

    installRealtimeDatabase() {
        this.log('Not implemented yet');
    }




};

