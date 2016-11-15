'use strict';
const koa = require('koa');

const app = koa();

app.use(function* () {
	this.body = Promise.resolve('foo bar');
});

app.listen(<%= port %>);
