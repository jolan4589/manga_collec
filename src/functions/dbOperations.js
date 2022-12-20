const { Collection } = require("discord.js");
const fs = require("fs");
const mirorsRelations = require("../database/mirors/relations.json");

module.exports = (client) => {
	client.dbOperations = async (databaseFolder, path) => {
		for (const folder of databaseFolder) {
			const databaseFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith(".js"));
			client.db[folder] = new Collection;
			for (const file of databaseFiles) {
				const content = require(`../database/${folder}/${file}`);
				client.db[folder].set(content.name, folder == "mirors" ? (await content.define(client)) : content.value);
			}
		}
		for (const relation of mirorsRelations) {
			await client.db.mirors.get(relation.source)[relation.link](client.db.mirors.get(relation.target), ...relation.args);
		}
	}
}