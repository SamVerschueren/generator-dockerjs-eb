'use strict';

/**
 * Yeoman generator for Docker Elastic Beanstalk applications.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  25 Sep. 2015
 */

// module dependencies
var path = require('path'),
    yeoman = require('yeoman-generator'),
    moment = require('moment'),
    uppercamelcase = require('uppercamelcase');

module.exports = yeoman.generators.Base.extend({
    init: function () {
        var done = this.async();

        // Ask the questions
        this.prompt([
            {
                name: 'functionName',
                message: 'What do you want to name project?',
                default: uppercamelcase(process.cwd().split(path.sep).pop())
            },
            {
                name: 'functionDescription',
                message: 'What\'s the description of the project?',
                validate: function (val) {
                    return val.length > 0 ? true : 'You have to provide a description';
                }
            },
            {
                name: 'keywords',
                message: 'Provide a list of keywords?',
                filter: function (keywords) {
                    return keywords.replace(/,? /g, ',').split(',');
                }
            },
            {
                name: 'port',
                message: 'What\s the port the application will be runnig on?',
                default: 8080,
                type: 'Number',
                validate: function (input) {
                    return input && (!isNaN(input) || input.match(/[1-9][0-9]+/));
                }
            },
            {
                name: 'githubUsername',
                message: 'What is your GitHub username?',
                store: true,
                validate: function (val) {
                    return val.length > 0 ? true : 'You have to provide a username';
                }
            }
        ], function (props) {
            // Build up the template
            var tpl = {
                functionName: props.functionName,
                functionDescription: props.functionDescription,
                keywords: props.keywords,
                port: props.port,
                name: this.user.git.name(),
                email: this.user.git.email(),
                year: moment().year()
            };

            var mv = function (from, to) {
                this.fs.move(this.destinationPath(from), this.destinationPath(to));
            }.bind(this);

            // Copy the template files
            this.fs.copyTpl(this.templatePath() + '/**', this.destinationPath(), tpl);

            // Rename the files
            mv('app/_package.json', 'app/package.json');

            // We are done!
            done();
        }.bind(this));
    },
    install: function () {
        // Install node dependencies
        this.npmInstall(undefined, {
            cwd: 'app'
        });
    }
});