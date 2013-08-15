/**
 * Created with IntelliJ IDEA.
 * User: Joe Linn
 * Date: 8/9/13
 * Time: 10:00 AM
 * To change this template use File | Settings | File Templates.
 */
module.exports = function(config){
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        files: [
            'lib/*.js',
            'app/components/angular/angular.js',
            'app/components/angular-mocks/angular-mocks.js',
            //'app/components/angular-scenario/angular-scenario.js',
            'natural-language.js',
            'test/*.js'
        ],
        autoWatch: true,
        browsers: ['firefox']
    });
};