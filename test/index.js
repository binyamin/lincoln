import assert from 'node:assert/strict';
import { describe, before, after, it } from 'node:test';
import lincoln from '../index.js';
import serve from '../lib/serve.js';

const srvr = new serve('./test/fixtures');

describe('lincoln - test for broken links', () => {

	before(() => {
		srvr.start()
	})

	after(() => {
		srvr.stop();
	})

	it('should throw error, when param url is missing', async () => {
		await assert.rejects(lincoln(), {
			message: 'URL not provided!'
		})
	});
	it('should be empty, when no links are present', async () => {
		const out = await lincoln('http://localhost:3000/none-present')
		assert.equal(out.total, 0);
	})
	it('should return empty `broken`, when no links are broken', async () => {
		const out = await lincoln('http://localhost:3000/none-broken');
		assert.equal(out.broken.length, 0);
	})
	it('should return positive `total`, when some links are present', async () => {
		const out = await lincoln('http://localhost:3000/none-broken');
		assert.equal(out.total, 1);
	})
	it('should return positive `broken`, if some links are broken', async () => {
		const out = await lincoln('http://localhost:3000/some-broken')
		assert.equal(out.total, 2);
		assert.equal(out.broken.length, 1); // broken.length > 0
	})
})
