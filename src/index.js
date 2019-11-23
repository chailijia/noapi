
const caller = require('caller');
const me = require('kdo')({exclude: 'test'});
const data = require('./data');

const createNoapiDo = () => {

	// Add shortcuts for data.global.xxx
	noapi.do = data.global.api.do;
	noapi.api = data.global.api.do;
	noapi.biz = data.global.biz.do;
};

const noapi = (options = {}) => {
	if (typeof options === 'number') {
		options = {port: options};
	}

	me.data.init(caller(), options);

	me.loader.init();
	me.api.init();
	me.biz.init();

	createNoapiDo();

	return me.web.start();
};

noapi.test = (userConfig) => {
	data.initForTest(caller());

	const test = require('./test');
	test(userConfig);
};

noapi.params = me.utils.params;
noapi.url = me.utils.url;

module.exports = noapi;
