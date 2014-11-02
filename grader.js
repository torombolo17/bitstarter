#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.
*/

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var DEFAULT_URL = "";
var DEFAULT_CHECK = "";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var response2console = function(result, response) {
    if (result instanceof Error) {
        console.error('Error: ' + util.format(response.message));
    } else {
        fs.writeFileSync('url.html', result);
        var checkJson = checkHtmlFile('url.html', DEFAULT_CHECK);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    }
};

var checkUrl = function(infile) {
    DEFAULT_URL = infile;    
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url  <url_links>', 'Path to index.html',clone(checkUrl))
	.parse(process.argv);
    var argvs = JSON.stringify(process.argv, null, 4);
    if (argvs.indexOf("-u") == -1){
    	var checkJson = checkHtmlFile(program.file, program.checks);
    	var outJson = JSON.stringify(checkJson, null, 4);
    	console.log(outJson);
    }
    else {
    	DEFAULT_CHECK = program.checks;
    	rest.get(DEFAULT_URL).on('complete', response2console);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
