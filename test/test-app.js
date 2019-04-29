/* global describe, beforeEach, it */

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('JHipster generator google-firebase', () => {
    describe('Test with Maven and Angular2', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/maven-angular2'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    firebase: 'FCM',
                    firebaseServerKey: '1234bcnxbc',
                })
                .on('end', done);
        });


        it('generate Java classes', () => {
            assert.file([
                'src/main/java/com/mycompany/myapp/service/AndroidPushNotificationsService.java',
                'src/main/java/com/mycompany/myapp/service/HeaderRequestInterceptor.java',
                'src/main/java/com/mycompany/myapp/web/rest/WebController.java'
            ]);
        });
    });

    describe('Test with Gradle and Angular1', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/gradle-angular1'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    firebase: 'FCM',
                    firebaseServerKey: '1234bcnxbc',
                })
                .on('end', done);
        });


        it('generate Java classes', () => {
            assert.file([
                'src/main/java/com/mycompany/myapp/service/AndroidPushNotificationsService.java',
                'src/main/java/com/mycompany/myapp/service/HeaderRequestInterceptor.java',
                'src/main/java/com/mycompany/myapp/web/rest/WebController.java'
            ]);
        });
    });

    describe('Test with firebase database', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/firebase'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    firebase: 'FCM',
                    firebaseServerKey: '1234bcnxbc',
                })
                .on('error', () => {
                    done();
                })
                .on('end', done);
        });

        it('doesn\'t generate Java classes', () => {
            assert.noFile([
                'src/main/java/com/mycompany/myapp/service/AndroidPushNotificationsService.java',
                'src/main/java/com/mycompany/myapp/service/HeaderRequestInterceptor.java',
                'src/main/java/com/mycompany/myapp/web/rest/WebController.java'
            ]);
        });
    });

    describe('Test with blueprint', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/ngx-blueprint'), dir);
                })
                .withOptions({
                    testmode: true
                })
                .withPrompts({
                    firebase: 'FCM',
                    firebaseServerKey: '1234bcnxbc',
                })
                .on('end', done);
        });


        it('generate Java classes', () => {
            assert.file([
                'src/main/java/com/mycompany/myapp/service/AndroidPushNotificationsService.java',
                'src/main/java/com/mycompany/myapp/service/HeaderRequestInterceptor.java',
                'src/main/java/com/mycompany/myapp/web/rest/WebController.java'
            ]);
        });
    });
});
