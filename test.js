import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';
import tempfile from 'tempfile';

test.beforeEach(async t => {
	t.context.dir = tempfile();
	await pify(helpers.testDirectory)(t.context.dir);
	t.context.generator = helpers.createGenerator('dockerjs-eb', [path.join(__dirname, '/app')], null, {skipInstall: true});
});

test.serial('generates expected files', async t => {
	const generator = t.context.generator;

	helpers.mockPrompt(generator, {
		functionName: 'test',
		functionDescription: 'test description',
		keywords: ['foo', 'bar', 'baz'],
		port: 80,
		githubUsername: 'SamVerschueren'
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'.editorconfig',
		'.gitattributes',
		'.gitignore',
		'.dockerignore',
		'Dockerrun.aws.json',
		'Dockerfile',
		'license',
		'readme.md',
		'app/package.json',
		'app/index.js'
	]);
});
