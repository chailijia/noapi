
const _ = require('lodash');
const lib = require('../../../__lib');

const me = {
	parse(apiDefineArr) {
		const apiInfos = [];
		apiDefineArr.forEach(item => {

			// api: /bill/form/crud
			// url: http://localhost:3000/bill/form/crud?formname=trader
			if (typeof item === 'string') {
				const {api, title, url} = lib.urlParser.getApiTitleUrlFromString(item);
				apiInfos.push({api, title, url});
			}

			// {api, title, url}
			if (_.isPlainObject(item)) {
				let {api, title, url} = item;

				// There must be at least one api and url.
				if (!api && !url) return;

				if (!api) { // There is a url
					api = lib.urlParser.getApiFromUrl(url);
				}
				else { // There is a api
					url = lib.urlParser.getUrlFromApi(api);
				}

				!title && (title = lib.urlParser.getTitleFromApi(api));
				apiInfos.push({api, title, url});
			}
		});

		return apiInfos;
	}
};

module.exports = me;