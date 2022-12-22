const assert = require("assert");
const fs = require("fs");

function assertEqual(f, expected, num=1, over=1, ...args) {
	let val
	try {
		val = f(...args);
		assert.equal(JSON.stringify(val), JSON.stringify(expected));
		console.log(`Test ${num}/${over} \x1b[32m<passed>\x1b[0m`);
		return true;
	} catch (error) {
		if (error.name == "AssertionError") {
			console.log(`Expected : ${expected} got ${val} for ${args} \x1b[31m<failed>\x1b[0m`);
		} else {
			console.log(error);
		}
		return false;
	}
}

function multipleAssertEqual(f, ...args) {
	const len = args.length;
	let result = [0,0];
	for (const i in args) {
		assertEqual(f, args[i].expected, parseInt(i) + 1, len, ...(args[i].args)) ? result[0]++ : result[1]++;
	}
	return result;
}

function createTestData(expected, args) {
	return {
		expected: expected,
		args: args
	}
}

function getArgsFromJson(json) {
	let args = [];

	for (const elem of json) {
		for (const data of elem.data) {
			args.push(createTestData(elem.expected, data))
		}
	}
	return args
}

function runAllTests(path) {
	const subDir = fs.readdirSync("./src/unitTest" + path, {withFileTypes: true}).filter(file => file.isDirectory()).map(file => file.name);
	const subFiles = fs.readdirSync("./src/unitTest" + path).filter(file => file.endsWith(".json"));
	let result = [];

	console.log("./src/unitTest" + path);
	for (const file of subFiles) {
		const f = require(`../${path}`)[file.slice(0,-5)];
		const tmp = getArgsFromJson(require(`.${path}/${file}`));

		console.log(`<----- ${file.slice(0,-5)} ----->`);
		result.push({name: file, result: multipleAssertEqual(f, ...tmp)});
	}

	result.forEach(res => {
		console.log(`< Result ${res.name} : \x1b[32m${res.result[0]}\x1b[0m/${res.result[0] + res.result[1]} >`);
		if (res.result[1] > 0) console.log(`< Failed : \x1b[32m${res.result[1]}\x1b[0m >`);
	});

	console.log(`< Total passed : ${result.map(val => val.result[0]).reduce((a,b) => a+b, 0)}/${result.map(val => val.result[1] + val.result[0]).reduce((a, b) => a + b, 0)} >`);
	for (const dir of subDir) {
		runAllTests(`${path}/${dir}`)
	}
}

runAllTests("");

module.exports = {
	multipleAssertEqual,
	assertEqual,
	createTestData
}