var sleight = require('sleight')
  , path = require('path')
  , cwd = process.cwd()
  , hash = { public: cwd } // default: start sleight in the current directory
  , puts = console.log

if (process.argv[2] == "help") {
	puts("sleight command line interface\n")
	puts("  options")
	puts("    port=number ; run sleight on port #number (default: 8088)")
	puts("    public=directory ; serve static files from given directory (default is `cwd`)")
	puts("    target=hostname:port ; serve remote requests from here (default is `www.phonegap.com:80`)")
	puts("    --silent ; don't log any data (defaults logs to stdout)")
	return
}

// loop through the supplied arguments
process.argv.forEach(function (val) {
	// use -- for boolean options
	if (val.indexOf('--') === 0)
		hash[val.split('--')[1]] = true
	// use = for named options
	else if (val.split('=').length == 2) {
		var keyVal = val.split('=')
		if (keyVal.length == 2) hash[keyVal[0]] = keyVal[1]
	}
})

// if a relative path is passed, resolve based on cwd
if (hash.public && hash.public.indexOf('/'))
	hash.public = path.join(cwd, hash.public)

// ensure port is a numeric argument
if (hash.port) hash.port = +hash.port

sleight.run(hash)
