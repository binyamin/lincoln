import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as util from '../../lib/util.js';

describe('Utility functions #unit', () => {
	it('prefixUrl() - should prefix url if necessary', () => {
		const result = util.prefixUrl('binyam.in');
		assert.equal(result, 'https://binyam.in');
	});

	it('prefixUrl() - should not prefix url if unnecessary', () => {
		const result = util.prefixUrl('http://binyam.in');
		assert.equal(result, 'http://binyam.in');
	});
});
