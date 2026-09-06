import { createServer } from 'node:http';
import handler from 'serve-handler';

class serve {
	#server;
	constructor(dir) {
		this.#server = createServer((request, response) => {
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

export default serve;
