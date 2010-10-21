var   http = require('http')
	, sys = require('sys')
	, path = require('path')
	, paperboy = require('paperboy')
	, defaults = {
		  public: path.dirname(__filename)
		, port: 8088
		, target: {
			  domain: 'www.phonegap.com'
			, port: 80
		}
	}

exports.run = function (options) {
	// TODO: this, but less ugly
	var options = options || defaults
	  , port = options.port || defaults.port
	  , public = options.public || defaults.public
	  , targetDomain = options.target.domain || defaults.target.domain
	  , targetPort = options.target.port || defaults.target.port
	  , client = http.createClient(targetPort, targetDomain)

	http.createServer(function (req, res) {
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
	}).listen(port)
}
