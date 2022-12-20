const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName("dbget")
		.setDescription("Get Test from db")
		.addStringOption(option =>
			option.setName("name")
				.setDescription("Find occurence with name = name")
				.setRequired(true)
		)
		.addBooleanOption(option =>
			option.setName("hide")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async execute(interaction) {
		const targetname = interaction.options.getString("name");
		const tag = await interaction.client.db.mirors.get("Test").findOne({ where: { name: targetname } });

		let message = "";
		console.log(">", tag)
		if (tag) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			tag.increment('usage_count');

			message = tag.get('description');
		} else {
			message = `Could not find tag: ${targetname}`;
		}
		await interaction.reply({content: message, ephemeral: interaction.options.getBoolean("hide")})
	}
}

/*
equivalent to: UPDATE tags (description) values (?) WHERE name='?';
	const affectedRows = await Tags.update({ description: value }, { where: { name: selector } });

	if (affectedRows > 0) {
			return interaction.reply(`Tag ${tagName} was edited.`);
	}


equivalent to: SELECT name FROM tags;
	const tagList = await Tags.findAll({ attributes: ['name'] });
	const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

equivalent to: DELETE from tags WHERE name = ?;
	const rowCount = await Tags.destroy({ where: { name: tagName } });

	if (!rowCount) return interaction.reply('That tag doesn\'t exist.');

	return interaction.reply('Tag deleted.');
*/