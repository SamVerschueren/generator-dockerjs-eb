'use strict';
const path = require('path');
const yeoman = require('yeoman-generator');
const moment = require('moment');
const uppercamelcase = require('uppercamelcase');

module.exports = class extends yeoman.Base {

	init() {
		return this.prompt([
			{
				name: 'functionName',
				message: 'What do you want to name project?',
				default: uppercamelcase(process.cwd().split(path.sep).pop())
			},
			{
				name: 'functionDescription',
				message: 'What\'s the description of the project?',
				validate: val => val.length > 0 ? true : 'You have to provide a description'
			},
			{
				name: 'keywords',
				message: 'Provide a list of keywords?',
				filter: keywords => keywords.replace(/,? /g, ',').split(',')
			},
			{
				name: 'port',
				message: 'What\'s the port the application will be runnig on?',
				default: 8080,
				type: 'Number',
				validate: input => input && (!isNaN(input) || input.match(/[1-9][0-9]+/))
			},
			{
				name: 'githubUsername',
				message: 'What is your GitHub username?',
				store: true,
				validate: val => val.length > 0 ? true : 'You have to provide a username'
			}
		]).then(props => {
			// Build up the template
			const tpl = {
				functionName: props.functionName,
				functionDescription: props.functionDescription,
				keywords: props.keywords,
				port: props.port,
				name: this.user.git.name(),
				email: this.user.git.email(),
				year: moment().year()
			};

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			// Copy the template files
			this.fs.copyTpl(`${this.templatePath()}/**`, this.destinationPath(), tpl);

			// Rename the files
			mv('app/_package.json', 'app/package.json');
		});
	}

	install() {
		// Install node dependencies
		this.npmInstall(undefined, {cwd: 'app'});
	}
};
