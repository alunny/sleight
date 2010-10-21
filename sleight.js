var   http = require('http')
	, sys = require('sys')
	, path = require('path')
	, paperboy = require('paperboy')
	, pb = require('paperboy')
	, port = 8088
	, public = path.dirname(__filename)
	, domain = "www.phonegap.com"
	, client = http.createClient(80, domain)

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
					host: domain
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
