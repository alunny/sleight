var http = require('http')

// demo http server used for testing
module.exports = http.createServer(function (req, res) {
	var msg = 'Hello World!'
	if (req.url == "/hello") {
		res.writeHead(200, {
			  'Content-Type': 'text/plain'
			, 'Content-Length': msg.length
		})
		res.end(msg)
	} else {
		msg = 'Error 404: File Not Found'
		res.writeHead(404, {
			  'Content-Type': 'text/plain'
			, 'Content-Length': msg.length
		})
		res.end(msg)
	}
})
