
const fs = require('fs');

// process.argv []:
// 		0		1				2
// 		node	createTests.js	$isBreakOnError
const isBreakOnError = process.argv[2];

const main = () => {
	const folders = fs.readdirSync(__dirname);
	const lines = [
		'isBreakOnError=' + isBreakOnError,
	];

	folders.forEach(folderName => {
		if (folderName.substr(0, 1) === '.') return;
		if (folderName.substr(0, 2) === '02' || folderName.substr(0, 2) === '03') return;

		const folderPath = __dirname + '/' + folderName;
		if (!fs.statSync(folderPath).isDirectory()) return;

		lines.push('cd ' + folderPath);
		lines.push('npm test; [[ $? -ne 0 && isBreakOnError -eq 1 ]] && exit');
	});

	const filename = __dirname + '/.test.temp.sh';
	fs.writeFileSync(filename, lines.join('\n'));
};

main();