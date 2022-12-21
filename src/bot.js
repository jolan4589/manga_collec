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
const dbFolders = fs.readdirSync("./src/database", {withFileTypes: true}).filter(file => file.isDirectory()).map(file => file.name);

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
const CommandsFolders = fs.readdirSync("./src/commands", {withFileTypes: true}).filter(file => file.isDirectory()).map(file => file.name);
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
	


	arte = await testAddDb("Series", {title: "Arte", editor: "OSEF", inShort: "Arte truc chelou", ended: false});
	gto = await testAddDb("Series", {title: "GTO", editor: "OSEF2", inShort: "Un prof yanke", ended: true});
	
	jolan = await testAddDb("Collections", {owner: "Jolan"})
	jolan = await testAddDb("Collections", {owner: "Anthony"})

	arteJo = await testAddDb("UserSeries", {title: "Arte", owner: "Jolan"});
	gtoJo = await testAddDb("UserSeries", {title: "GTO", owner: "Jolan"});
	arteAntho = await testAddDb("UserSeries", {title: "Arte", owner: "Anthony"});
	gtoAntho = await testAddDb("UserSeries", {title: "GTO", owner: "Anthony"});

	const res = await testGetDb("UserSeries", {title: "Arte", owner: "Jolan"})
	console.log("-->", (await res[0].getSeries()));

	client.login(Conf.token);
})();

getMethods = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')


async function testAddDb(table, data) {
	try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const elem = await client.db.mirors.get(table).create(data);
			console.log("element added");
			return elem
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				console.log('That element already exists.');
			} else {
				console.log('Something went wrong with adding a tag.', data);
			}
		}
}

async function testGetDb(table, where = {}) {
		return (await client.db.mirors.get(table).findAll({ where: where}))
}

/* Supprimer une commande

const guildId = "773987727746007040"
const clientId = "790926062795620352"
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(Conf.token);

// Guilde
await rest.delete(Routes.applicationGuildCommand(clientId, guildId,'1054510339468828752'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// Globall
await rest.delete(Routes.applicationCommand(clientId,'commandId'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);
*/
