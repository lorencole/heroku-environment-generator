#!/usr/bin/env node
var exec = require('child_process').execSync;
var fs = require("fs");
//var prompt = require('prompt');
var argv = require('yargs')
			.usage('Usage: $0 --app [heroku_app_name] \n   or: source $0 --source')
			.option('app', {
				alias: 'a',
				describe: 'Specify a heroku app`'
			})
			/*.option('source', {
				alias: 's',
				describe: 'Immediately export heroku environment variables into your shell. NOTE: to export environment variables you must call with \'source generate-env -source\''
			})*/
			.help('h')
			.alias('h','help')
			.argv;

var herokuConfigCmd = "heroku config -s"
if(argv.app) {
	herokuConfigCmd += " --app " + argv.app;
}

var writeFile = function(filename, config) {
	var fstream = fs.createWriteStream(filename, {
	  flags: 'w',
	  defaultEncoding: 'utf8',
	  fd: null,
	  mode: 0o775,
	  autoClose: true
	});
	fstream.write('#!/bin/bash\n');
	config.forEach(function(env_var) {
		fstream.write('export ' + env_var + '\n');
	})
	fstream.write('echo "Usage: source ' + filename + '"')
	fstream.end();
}
/* query heroku for the config */
herokuConfig = exec(herokuConfigCmd, {encoding: 'UTF-8'});
/* trim "'s and trailing newline*/
herokuConfig = herokuConfig.replace(/^\"|\"$|\n$/g, "");
var config = herokuConfig.split('\n');

/* ==== Tweak environment variables for running locally */
/* Add ssl fix to postgres urls */
config.forEach(function(env_var, idx, array) {
	if(env_var.match(/^DATABASE_URL='postgres/)) {
		array[idx] = env_var.replace(/'$/, "?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory");
	}
})
/* ==== */

var filename = argv.app ? argv.app : "heroku_env";
filename += ".config";
// TODO: Prompt if file already exists
writeFile(filename, config);

/* if not source write to a file */
/*if(!argv.source) {
	var filename = argv.app ? argv.app : "heroku_env";
	filename += ".config";
	// TODO: Prompt if file already exists
	writeFile(filename, config);
} else {
	// write to the environment instead
	config.forEach(function(env_var) {
		process.stdout.write('\'' + env_var + '\'' + '\n');
	})
*/
}

//console.log(JSON.stringify(config, null, '\t'));
