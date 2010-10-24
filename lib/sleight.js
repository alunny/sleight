var   http = require('http')
	, path = require('path')
	, paperboy = require('paperboy')
	, defaults = {
		  public: path.join(path.dirname(__filename), '..')
		, port: 8088
		, target: {
			  domain: 'www.phonegap.com'
			, port: 80
		}
	}

exports.start = function (options) {
	// TODO: this, but less ugly
	var options = options || defaults
	  , port = options.port || defaults.port
	  , public = options.public || defaults.public
	  , targetDomain = options.target.domain || defaults.target.domain
	  , targetPort = options.target.port || defaults.target.port
	  , client = http.createClient(targetPort, targetDomain)
	  , sleightServer = http.createServer(function (req, res) {
			paperboy
				.deliver(public, req, res)
				.addHeader('Expires', 300)
				.error(function (status, msg) {
					res.writeHead(status, {'Content-Type': 'text/plain'})
					res.end('Error ' + status)
				})
				.otherwise(function (err) {
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
		}
	}
}

exports.run = function (options) {
	exports.start(options).run()
}
