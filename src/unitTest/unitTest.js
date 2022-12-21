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

// init path with "./src/unitTest"
function runAllTests(path) {
	console.log("./src/unitTest" + path)
	const subDir = fs.readdirSync("./src/unitTest" + path, {withFileTypes: true}).filter(file => file.isDirectory()).map(file => file.name);
	const subFiles = fs.readdirSync("./src/unitTest" + path).filter(file => file.endsWith(".json"));
	for (const dir of subDir) {
		runAllTests(`${path}/${dir}`)
	}
	for (const file of subFiles) {
		const f = require(`../${path}`)[file.slice(0,-5)]
		const tmp = getArgsFromJson(require(`.${path}/${file}`))
		console.log(`<----- ${file.slice(0,-5)} ----->`)
		const result = multipleAssertEqual(f, ...tmp)
		console.log(`< Result ${file.slice(0,-5)} : \x1b[32m${result[0]}\x1b[0m/${result[0] + result[1]} >`);
		if (result[1] > 0) console.log(`< Failed : \x1b[32m${result[1]}\x1b[0m >`)
	}
}

runAllTests("");
module.exports = {
	multipleAssertEqual,
	assertEqual,
	createTestData
}