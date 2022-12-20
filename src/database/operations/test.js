module.exports = {
	name: "test",
	async value(...args) {
		console.log("oui", ...args);
	}
}