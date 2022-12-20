const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName("dbadd")
		.setDescription("Create new Test'")
		.addStringOption(option =>
			option.setName('name')
				.setDescription('New name')
				.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('description')
				.setDescription('New description')
				.setRequired(true)
			)
		.addBooleanOption(option =>
			option.setName("hide")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async execute(interaction) {

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await interaction.client.db.mirors.get("Test").create({
				name: interaction.options.getString("name"),
				description: interaction.options.getString("description"),
				username: interaction.user.username,
			});
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
		interaction.client.db.mirors.get("Test")
		
	

		await interaction.reply({content: `tmp`, ephemeral: interaction.options.getBoolean("hide")})
	}
}
