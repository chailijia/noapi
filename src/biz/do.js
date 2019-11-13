
const data = require('../data');
const lib = require('../__lib');

const tryParseJsonString = {
	do(jsonString) {
		const o = this.eval(jsonString) || this.parse(jsonString);
		if (o && typeof o === "object") {
			return o;
		}
	},

	eval(jsonString) {
		try {
			let o;
			eval('o = ' + jsonString);
			return o;
		}
		catch (e) {}
	},

	parse(jsonString) {
		try {
			return JSON.parse(jsonString);
		}
		catch (e) {}
	}
};

// Convenient api quick calls to its biz method
// 		complete: 		data.core.mms.biz.bill.mnf.manuPlan(query)
// 		Shorthand: 		global.biz.do(query)
// Note:
// 		Can only be called internally by the current subsystem, not across subsystems
const fn = async (query) => {

	// Fetch sysName and api path from query.__
	//		sysName: "mms"
	//		api: "bill.mnf.manuPlan"
	const {sysName, api} = query.__;

	// Get the biz object of the current subsystem,
	// for example: data.core.mms.biz
	const sysBizs = data.core[sysName].biz;

	// Get biz functions based on sysName, api, sysBizs,
	// for example: data.core.mms.biz.bill.mnf.manuPlan
	const sysBizFn = lib.getSysApiFn(sysName, api, sysBizs);
	if (typeof sysBizFn !== 'function') {
		return {error: `The handler ./biz${api}.js does not exists.`};
	}

	// Automatically parse json string if needed
	if (data.queryOptions.isParseJsonStr) {
		const allKeys = Object.keys(query);

		// Remove keys created by noapi
		const ignoreKeys = ['__', 'originalUrl'];
		const keys = allKeys.filter(item => ignoreKeys.indexOf(item) === -1);

		keys.forEach(key => {
			const o = tryParseJsonString.do(query[key]);
			if (o) {
				query[key] = o;
			}
		});
	}

	// If there is no params, or just only one parameter named "query", pass the whole query
	const params = data.bizParams[sysName][api];
	if (!params || params.length === 1 && params[0] === 'query') {
		return await sysBizFn(query);
	}
	else {
		// Otherwise, pass query[paramName]
		const args = params.map(paramName => query[paramName]);
		return await sysBizFn(...args);
	}
};

module.exports = fn;
