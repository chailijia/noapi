
// See /noapi/src/defineJs_demos.js to learn more.

const me = [
	{
		// The demo url with parameters
		url: 'http://localhost:3000/bill/form/crud?formname=trader',

		// Expected result
		result: {
			"success": true,
			"data": {
				"formname": "trader"
			}
		}
	}
];

module.exports = me;