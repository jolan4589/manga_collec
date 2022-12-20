const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Reply with 'Pong!'")
		.addBooleanOption(option =>
			option.setName("hidde")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async execute(interaction) {
		const hide = interaction.options._hoistedOptions.find(elem => elem.name == "hidde") && true;
		await interaction.reply({content: "Pong!", ephemeral: hide})
	}
}
