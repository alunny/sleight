var path = require('path')
  , sys = require('sys')
  , vows = require('vows')
  , assert = require('assert')
  , fs = require('fs')
  , client = require('http').createClient(3333, 'localhost')

require.paths.unshift(path.join(path.dirname(__filename), '..'))

// local requires
var sleight = require('lib/sleight')
  , testServer = require('spec/fixtures/server')
  , public = path.join(path.dirname(__filename), 'fixtures', 'static')
  , publicIndex = fs.readFileSync(path.join(public, 'index.html'))

// starting a test "remote" server
testServer(4444)

sleight.run({
	  public: public
	, port: 3333
	, target: {
		domain: 'localhost'
	  , port: 4444
	}
});

// wrapper to make a simple request
function makeGetRequest(path, callback) {
	var testReq = client.request('GET', path, { host: 'localhost' })
	testReq.end()
	testReq.on('response', function (response) {
		response.data = [];
		response.on('data', function (chunk) {
			response.data.push(chunk);
		})
		response.on('end', function () {
			response.data.join('')
			callback(null, response)
		})
	})
}

vows.describe('Sleight').addBatch({
	'get static file': {
		topic: function () {
			makeGetRequest('/index.html', this.callback)
		}
		, 'is an ok response': function (response) {
			assert.equal (200, response.statusCode)
		}
	}
	, 'get remote file': {

	}
	, '404 transferred': {

	}
}).export(module)
