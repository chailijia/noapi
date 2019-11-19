
const fs = require('fs');
const path = require('path');

let lib;

// Use loadLibForTest() to load lib instead of require it directly to avoid the error:
//		TypeError: lib.getApiServiceNameFromPath is not a function
const loadLibForTest = () => lib = require('./__lib');

const tools = {
	getWebServiceRoot(pathToCaller) {

		if (pathToCaller === '/') {
			throw new Error('no package.json found in parent path of ' + pathToCaller);
		}

		// Find package.json in parent path
		const parentPath = path.resolve(pathToCaller, '..');
		const packageJson = parentPath + '/package.json';

		// Found the package.json
		if (fs.existsSync(packageJson)) {

			// The parent path is the web services root directory
			return parentPath;
		}
		else {
			// Not found
			// Recurse to Find
			return this.getWebServiceRoot(parentPath);
		}
	},

	getIsTestMode(webServiceRoot) {
		let parent = module;
		let isTestMode;

		// If the ancestor's module.filename contains webServiceRoot + "/test/", then it is test mode.
		const testDir = (webServiceRoot + '/test/')
			.replace(/[\[\]\/$#]/g, (match) => {
				return '\\' + match;
			})
		;

		// If the ancestor's module.filename contains a test framework, then it is test mode.
		const regTestFrameworks = /\/node_modules\/(mocha\/)|(jest\/)|(jasmine\/)|(ava\/)|(tape\/)/i;

		while (true) {
			const reg = new RegExp(testDir, 'i');
			if (reg.test(parent.filename) || regTestFrameworks.test(parent.filename)) {
				isTestMode = true;
				break;
			}

			parent = parent.parent;
			if (!parent) break;
		}

		return isTestMode;
	}
};

/** @name me.data */
const me = {
	isSimpleMode: true,  // Whether the web service is api service

	webServiceRoot: '', // The root path of web service
	apiServicesRoot: {}, // The root path of api service(s)

	serverOptions: {
		serverName: 'default',
		host: 'localhost',
		port: 3000,
		protocol: 'http',

		// Show some tips in terminal if needed after started
		// prompt: {
		// 	tips: `
		// 		---------------------------------
		// 		Show some tips if needed.
		// 		---------------------------------
		// 	`,
		// 	isKeepIndentation: false,
		// },
	},

	serviceNames: [], // ["api-forms", "api-erp", "api-mms"]
	sysNames: [], // ["forms", "erp", "mms"] // Without prefix "api-"
	serviceSysNames: {}, // {"api-forms": "forms", "api-erp": "erp", "api-mms": "mms"} // For getting sysName by serviceName

	core: {/*sysName*/}, // {default: {aha, api, biz}} // See "data_demo.js" to learn more
	defineJs: {/*sysName*/}, // {default: {filename, api, io, test}} // See "data_demo.js" to learn more
	bizParams: {/*sysName*/}, // {default: {"/bill/form/crud": ["query"]}}

	assignRules: [], // The rules of assigning

	isTestMode: false, // If noapi is running from /test directory, then it is true.
	isSilence: false, // Do not print logs if it is true

	queryOptions: {
		isParseJsonStr: true, // If the value of query parameter is json str, then convert it to object
	},

	power: null, // The custom function to handle query

	global: {}, // {api, biz}

	testOptions: {
		apiServiceRoot: '', // The root path of the api service which is testing
		testRoot: '', // The root path of the test directory
		serviceName: '', // The name of the api service which is testing
		isFromApiService: false, // If the serviceName is api or api-xxx, then it is true
		port: 26739, // The port number dedicated to the test.
	},

	init(pathToCaller, options) {
		this.webServiceRoot = tools.getWebServiceRoot(pathToCaller);
		this.isTestMode = tools.getIsTestMode(this.webServiceRoot);

		this.assignRules = options.assignRules;
		this.power = options.power;

		options.serverName && (this.serverOptions.serverName = options.serverName);
		options.host && (this.serverOptions.host = options.host);
		options.port && (this.serverOptions.port = options.port);
		options.public && (this.serverOptions.public = options.public);
		options.prompt && (this.serverOptions.prompt = options.prompt);

		// Accept options.queryOptions and options.query
		Object.assign(this.queryOptions, options.queryOptions, options.query);
	},

	initForTest(pathToCaller) {
		loadLibForTest();

		this.webServiceRoot = tools.getWebServiceRoot(pathToCaller);
		this.isTestMode = true;

		// If pathToCaller is .../project/api/test/index.js, then:
		// 		testRoot			.../project/api/test
		// 		apiServiceRoot		.../project/api
		// 		serviceName			api
		this.testOptions.testRoot = path.resolve(pathToCaller, '../');
		this.testOptions.apiServiceRoot = path.resolve(this.testOptions.testRoot, '../');

		// "01-define-API-and-test-cases-with-array" => "default"
		let serviceName = lib.getApiServiceNameFromPath(this.testOptions.apiServiceRoot);
		let isLegalApiServiceName = lib.isLegalApiServiceName(serviceName);

		if (!isLegalApiServiceName) {
			serviceName = 'default';
		}

		this.testOptions.serviceName = serviceName;
		this.testOptions.isFromApiService = isLegalApiServiceName;
	}
};

module.exports = me;
