
const expect = require('chai').expect;

const lib = require('../__lib');
const runTestCase = require('../runTestCase');

const fn = (apiInfo, ioInfo, testInfo) => {
	const {api, title, url} = apiInfo;
	const {verify} = testInfo;
	const {params} = ioInfo;

	const testCaseTitle = lib.attachParamsToTitle(title, url, params);

	it(testCaseTitle, async () => {
		const result = runTestCase.do(api);
		const isOK = verify(result, JSON.stringify(result));
		expect(isOK).to.be.true;
	});
};

module.exports = fn;
