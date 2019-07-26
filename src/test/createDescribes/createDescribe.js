
const config = require('../config');
const createTestIt = require('../createTestIt');

const validator = {
	isOnlyApiPath: false,
	regStartWith: null,
	regExclude: null,

	init(title, isOnlyApiPath, usedApiPaths = []) {
		this.isOnlyApiPath = isOnlyApiPath;
		if (!isOnlyApiPath) return;

		if (title) {
			const startWithApiPath = this.formatRegStr(title);
			this.regStartWith = new RegExp('^' + startWithApiPath, 'i');
		}

		if (usedApiPaths.length) {
			const excludeApiPaths = usedApiPaths.map(usedApiPath => {
				return this.formatRegStr(usedApiPath);
			});
			const excludeApiPathsStr = '(' + excludeApiPaths.join(')|(') + ')';
			this.regExclude = new RegExp('^' + excludeApiPathsStr, 'i');
		}
	},

	formatRegStr(str) {
		return str
			.replace(/ /g, '')
			.replace(/^\S*?(?=\/)/, '')
			.replace(/\//g, '\\/')
		;
	},

	check(apiPath) {
		if (!this.isOnlyApiPath) return true;
		return this.regStartWith.test(apiPath) && (!this.regExclude || !this.regExclude.test(apiPath));
	}
};

const fn = (title, defineJs, {isOnlyApiPath, usedApiPaths} = {}) => {
	validator.init(title, isOnlyApiPath, usedApiPaths);

	const {api, docs} = defineJs;
	describe(title, () => {

		for (let i = 0; i < api.length; i ++) {
			const apiInfo = api[i];
			const docInfos = docs[i];

			if (!validator.check(apiInfo.api)) {
				continue;
			}

			if (!config.isValidTestCase(apiInfo.title)) {
				continue;
			}

			if (!docInfos.length) {
				it('- No test', () => {});
				continue;
			}

			docInfos.forEach(docInfo => {
				const ioInfo = docInfo.io;
				const testInfo = docInfo.test;

				// No testInfo property and result property, no need to test
				if (!testInfo && !ioInfo.result) return;

				// No verify property, can not test
				if (!testInfo.verify) return;

				testInfo.testUrl = testInfo.url || apiInfo.url;
				testInfo.getResult = testInfo.getResult || apiInfo.url;

				createTestIt(apiInfo, ioInfo, testInfo);
			});
		}
	});
};

module.exports = fn;
