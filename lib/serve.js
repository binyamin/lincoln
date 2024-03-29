const http = require('node:http');

const handler = require('serve-handler');

class serve {
	#server;
	constructor(dir) {
		this.#server = http.createServer((request, response) => {
			return handler(request, response, { public: dir })
		})
	}

	start(port = 3000) {
		this.#server.listen(port, () => {
			// console.log(`Server listening on localhost:${port}`);
		})
	}

	stop() {
		this.#server.close();
	}
}

module.exports = serve;
