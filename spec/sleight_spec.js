var path = require('path')
  , vows = require('vows')
  , assert = require('assert')
  , fs = require('fs')
  , client = require('http').createClient(3333, 'localhost')

require.paths.unshift(path.join(path.dirname(__filename), '..'))

// local requires
var sleight = require('lib/sleight')
  , testServer = require('spec/fixtures/server')
  , public = path.join(path.dirname(__filename), 'fixtures', 'static')
  , publicIndex = fs.readFileSync(path.join(public, 'index.html')).toString('utf8')
  , sleightServer

// starting a test "remote" server
testServer.listen(4444)

sleightServer = sleight.start({
	  public: public
	, port: 3333
	, target: 'localhost:4444'
	, silent: true
});

sleightServer.run()

// wrapper to make a simple request
function get(url) {
	return function () {
		var testReq = client.request('GET', url, { host: 'localhost' })
		  , callback = this.callback
		testReq.end()

		testReq.on('response', function (response) {
			response.data = [];
			response.on('data', function (chunk) {
				response.data.push(chunk);
			})
			response.on('end', function () {
				callback(null, response)
			})
		})
	}
}

vows.describe('Sleight').addBatch({
	'get static file': {
		topic: get('/index.html')
		, 'is an ok response': function (response) {
			assert.equal (200, response.statusCode)
		}
		, 'is the correct file': function (response) {
			assert.equal (publicIndex, response.data)
		}
	}
	, 'get remote file': {
		topic: get('/hello')
		, 'is an ok response': function (response) {
			assert.equal (200, response.statusCode)
		}
		, 'is the correct file': function (response) {
			assert.equal ('Hello World!', response.data)
		}
	}
	, '404 transferred': {
		topic: get('/error')
		, 'is a 404 response': function (response) {
			assert.equal (404, response.statusCode)
		}
	}
}).export(module)

// TODO: a legit teardown
setTimeout(function () {
	sleightServer.close()
	testServer.close()
}, 600);
