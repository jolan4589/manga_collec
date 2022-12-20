/* Constants */
// Discord
const {Client, GatewayIntentBits, Collection} = require("discord.js")
const Conf = require("./config.json");
const fs = require("fs");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
})

// Data base
const Sequelize = require("sequelize");
const dbFolders = fs.readdirSync("./src/database");

client.db = new Object();
client.db.sequelize = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	// SQLite only
	storage: "./src/collections.sqlite",
});

// Directory access
const Functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const CommandsFolders = fs.readdirSync("./src/commands");
const EventsFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));

client.commands = new Collection();

(async () => {
	for  (let file of Functions) {
		require(`./functions/${file}`)(client); // execute ./src/fonctions/*.js
	}
	
	await client.commandsHandlers(CommandsFolders, "./src/commands");
	await client.eventsHandlers(EventsFiles);
	await client.dbOperations(dbFolders, "./src/database");

	console.log("<Commands>\nglobal : ")
	client.globalCommandsArray.forEach(cmd => console.log("- ", cmd.name))
	console.log("others : ")
	client.commandsArray.forEach(cmd => console.log("- ", cmd.name))
	
	client.login(Conf.token);
})();