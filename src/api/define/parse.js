
const data = require('../../data');
const model = require('./model');

/** @name define.parse */
const fn = () => {
	if (data.apiDefinePaths.length === 0) return;
	data.apiDefinePaths.forEach(definePath => {
		const apiDefineArr = require(definePath);
		apiDefineArr.forEach(item => {

			// 'http://localhost:3000/bill/form/crud?formname=trader'
			if (typeof item === 'string') {

			}
		});
	});
};

module.exports = fn;
