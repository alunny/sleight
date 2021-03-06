var   http = require('http')
	, path = require('path')
	, paperboy = require('paperboy')
	, defaults = {
		  public: path.join(path.dirname(__filename), '..')
		, port: 8088
		, target: 'www.phonegap.com'
		, silent: false
	}

function doLog(msg) {
	var timestamp = ' @ ' + (new Date()).getTime()
	console.log(msg + timestamp)
}

// a noop
function noLog() { }

function aOrB(options, defaults) {
	return function (field) {
		if (options == undefined) return defaults[field]
		return options[field] != undefined ?
			options[field] : defaults[field]
	}
}

exports.start = function (options) {
	var choice = aOrB(options,defaults)
	  , port = choice('port')
	  , public = choice('public')
	  , silent = choice('silent')

	  , target = (choice('target')).split(':')
	  , targetDomain = target[0]
	  , targetPort = target[1] || 80

	  , client = http.createClient(targetPort, targetDomain)
	  , log = silent ? noLog : doLog
	  , sleightServer = http.createServer(function (req, res) {
			paperboy
				.deliver(public, req, res)
				.addHeader('Expires', 300)
				.after(function () {
					log('Static file served from: ' + req.url)
				})
				.error(function (status, msg) {
					res.writeHead(status, {'Content-Type': 'text/plain'})
					res.end('Error ' + status)
				})
				.otherwise(function (err) {
					log('Remote request to ' + targetDomain + ':' + targetPort + req.url)
					var newRequest = client.request(
						  req.method
						, req.url
						, {
							host: targetDomain
						})
					newRequest.end()
					newRequest.on('response', function (response) {
						var status = response.statusCode
						  , headers = response.headers

						res.writeHead(status, headers)

						response.on('data', function (chunk) {
							res.write(chunk)
						})

						response.on('end', function () {
							res.end()
						})
					})
				})
			})

	return {
		server: sleightServer
		, run: function () {
			this.server.listen(port)
			log('Listening on port ' + port)
		}
		, close: function () {
			this.server.close()
		}
	}
}

exports.run = function (options) {
	exports.start(options).run()
}
