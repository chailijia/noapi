
const _ = require('lodash');
const getVerifyFn = require('./getVerifyFn');

/** @name forDocs.parse */
const fn = (apiDefineArr) => {
	const allItems = [];

	apiDefineArr.forEach(item => {

		// item {
		// 		api,
		// 		title,
		// 		url,
		//
		// 		docs: [
		// 			{
		// 				params,
		// 				result,
		// 				test,
		// 			}
		// 		]
		// }

		if (!_.isPlainObject(item)) return;

		// {api, title, url, params, result, test} =>
		// {api, title, url,
		// 					docs: [
		// 						{params, result, test}
		// 					]
		// }
		if (!item.docs) {
			const {params, result, test} = item;
			item.docs = [{params, result, test}];
		}

		const docs = [];
		item.docs.forEach(doc => {

			// doc {
			//		params,
			//		result,
			//		test,
			// }

			let io;
			let test;

			// io: input params, output result
			io = {params: doc.params, result: doc.result};

			// If the test property is omitted
			if (!doc.test) {

				// The result returned from server must be matches the result property exactly
				if (doc.result) {
					test = {
						verify: getVerifyFn.forMatchingResultExactly(doc)
					};
				}
			}
			else {
				// There is a test property
				test = doc.test;

				// test: {
				// 		...
				// }
				if (_.isPlainObject(test)) {

					// A simple object:
					// 		test: {
					// 				formname: "trader",
					//				// verify, // without verify
					// 		}
					if (!test.verify) {
						test = {
							verify: getVerifyFn.forContainingKeyValues(test)
						}
					}
					else {
						// A standard test object:
						// 		test: {
						// 				beforeDo,
						// 				url,
						// 				getResult,
						// 				afterDo,
						// 				verify, // with verify (multiple forms)
						// 		}

						// verify(resultText, result) {
						// 		...
						// }
						if (typeof test.verify === 'function') {
							// do nothing
						}

						// verify: {
						// 		formname: 'trader',
						// }
						if (_.isPlainObject(test.verify)) {
							test.verify = getVerifyFn.forContainingKeyValues(test.verify);
						}

						// verify:
						// 		`"formname":"trader"`,
						if (typeof test.verify === 'string') {
							test.verify = getVerifyFn.forContainingString(test.verify);
						}

						// verify:
						// 		/(traderid)|(goodsid)/,
						if (test.verify instanceof RegExp) {
							test.verify = getVerifyFn.forRegExp(test.verify);
						}
					}
				}
				else {

					// test(resultText, result) {
					// 		...
					// }
					if (typeof test === 'function') {
						test = {
							verify: test
						}
					}

					// test: {
					// 		formname: 'trader',
					// }
					if (_.isPlainObject(test)) {
						test = {
							verify: getVerifyFn.forContainingKeyValues(test)
						}
					}

					// test:
					// 		`"formname":"trader"`,
					if (typeof test === 'string') {
						test = {
							verify: getVerifyFn.forContainingString(test)
						};
					}

					// test:
					// 		/(traderid)|(goodsid)/,
					if (test instanceof RegExp) {
						test = {
							verify: getVerifyFn.forRegExp(test)
						};
					}
				}
			}

			docs.push({io, test});
		});

		allItems.push(docs);
	});

	return allItems;
};

module.exports = fn;