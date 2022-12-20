const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");
const token = require("../config.json").token;
const guildId = "773987727746007040" // guildTestId
const clientId = "790926062795620352" // bot clientId

module.exports = (client) => {
	client.commandsHandlers = async (commandsFolder, path) => {
		client.commandsArray = [];
		client.globalCommandsArray = [];

		for (let folder of commandsFolder) {
			const commandsFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith(".js"));
			for (const file of commandsFiles) {
				const command = require(`../commands/${folder}/${file}`);
				client.commands.set(command.data.name, command);
				client[command.global ? "globalCommandsArray" : "commandsArray"].push(command.data.toJSON());
			}
		}

		const rest = new REST({
			version: "10"
		}).setToken(token);
		
		(async () => {
			try {
				console.log("Started refreshing application (/) commands.");
				/** For specified server */
				
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: client.commandsArray },
				);
				
				/** For Every servers */
				await rest.put(
					Routes.applicationCommands(clientId),
					{ body: client.globalCommandsArray },
				);

				console.log("Successfully reloaded application (/) commands.");
			} catch (error) {
				console.log(error);
			}
		})();
	}

}