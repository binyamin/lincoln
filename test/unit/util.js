const { expect } = require('chai');

const util = require('../../lib/util');

describe('Utility functions #unit', () => {
	it('prefixUrl() - should prefix url if necessary', () => {
		const result = util.prefixUrl('binyam.in');
		expect(result).to.be.a('string');
		expect(result).to.eql('https://binyam.in');
	})

	it('prefixUrl() - should not prefix url if unnecessary', () => {
		const result = util.prefixUrl('http://binyam.in');
		expect(result).to.be.a('string');
		expect(result).to.eql('http://binyam.in');
	})
})
