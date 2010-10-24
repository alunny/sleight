Sleight
=======

> Static File Serving and Reverse Proxying, for fun and deception

What
----
Sleight allows you to easily set up a local server that serves static files when you have those files present, and reverse proxies to a remote server when those files aren't present.

In effect, for front-end developers, static pages on a Sleight server simulate the behaviour of pages served from the file protocol, in that their XHRs can violate cross-domain policy (because the cross-domain requests go through the server from the same origin). If that makes sense.

It's mostly useful for [PhoneGap][2] development, when you may want to test your app from a web server though it will ultimately run from the file protocol.

Installation
------------

    $ npm install sleight

Usage
-----

	$ cd my_static_site
	$ ls
	index.html another.html image.png
	$ cat index.html
	<p>Hello World!</p>
	$ curl http://myremoteserver.com/goodbye
	<p>Goodbye Cruel World</p>
	$ sleight port=4000 target=myremoteserver.com
	
(in another shell)

	$ curl http://localhost:4000/
	<p>Hello World!</p>
	$ curl http://localhost:4000/goodbye
	<p>Goodbye Cruel World</p>

Sleight can also be required as a common js module

	sleight = require('sleight')

	sleight.run({
        port: 4000
		, public: "~/my_static_site"
		, target: "myremoteserver.com"
	})

Sleight is specced with [vows][1]

	$ git clone alunny/sleight # use hub!
	$ cd sleight
	$ vows spec/sleight_spec.js

[1]:http://vowsjs.org
[2]:http://www.phonegap.com
