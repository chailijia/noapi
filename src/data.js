
const fs = require('fs');
const path = require('path');

const optionsDefault = {
	serverName: 'default',
	port: 3000,
};

/** @name me.data */
const me = {
	webServiceRoot: '', // root path of web service
	apiServicesRoot: '', // root path of api service(s)
	apiDefinePaths: [], // path of .../api/defines.js in all api services
	isSimpleMode: true, // single api service (web service is api service)

	serviceNames: [], // ["api-forms", ...]
	sysNames: [], // ["forms", ...]
	serviceSysNames: {}, // {"api-forms": "forms", "api-erp": "erp"} // for getting sysName by serviceName

	core: {}, // {aha, api, biz}
	assignRules: [], // rules of assigning

	isSilence: false, // do not print logs if it is true

	power: null, // the custom function to handle query

	init(options) {
		this.webServiceRoot = this.getWebServiceRoot(options.pathToCaller);
		this.assignRules = options.assignRules;
		this.power = options.power;

		options.serverName = options.serverName || optionsDefault.serverName;
		options.port = options.port || optionsDefault.port;
	},

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
	}
};

module.exports = me;