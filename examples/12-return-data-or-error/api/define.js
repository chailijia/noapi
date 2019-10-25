
// See "04-define-API-and-test-cases-[completely]" to learn more.

const me = [

	// Return error
	{
		url: 'http://localhost:3000/bill/form/crud?formName=trader',
		result: {
			"success": false,
			"error": "The formName must be employee"
		}
	},

	// Return data
	{
		url: 'http://localhost:3000/bill/form/crud?formName=employee',
		result: {
			"success": true,
			"data": {
				"formName": "employee"
			}
		}
	},

	{
		url: 'http://localhost:3000/bill/form/check?billid=123&act=check',
		result: {
			"success": true,
			"data": {
				"billid": "123",
				"checked": true
			}
		}
	},

	{
		url: 'http://localhost:3000/bill/form/check?billid=123&act=uncheck',
		result: {
			"success": true,
			"data": {
				"billid": "123",
				"checked": false
			}
		}
	},
];

module.exports = me;
