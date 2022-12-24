const fs = require("fs");

/**
 * Setup every function to a UserSeries miror.
 * 
 * @param {Discord.Client} client 
 */
module.exports = async function (client) {
	const files = fs.readdirSync("./src/database/operations/userSeries").filter(file => file.endsWith(".js")).map(file => file.slice(0,-3));	
	let userSeries;

	//console.log(">", client.db.mirors);
	while (!(userSeries = await client.db.mirors.get("UserSeries"))) {
		console.log(userSeries)
	}

	for (const file of files) {
		userSeries[file] = require(`./userSeries/${file}.js`);
	}
}