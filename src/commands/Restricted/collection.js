const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: false,
	alias: {
		global: [],
		local: []
	},
	data: new SlashCommandBuilder()
		.setName("collection")
		.setDescription("print your collection")
		.addIntegerOption(option =>
			option.setName("sort")
				.setDescription("Order to sort.")
				.setRequired(false)
				.addChoices(
					{ name: "ascend", value: 1 },
					{ name: "descend", value: -1 },
				)
			)
		.addStringOption(option =>
			option.setName("sortby")
				.setDescription("Wich to field sort")
				.setRequired(false)
				.addChoices(
					{ name: "seriename", value: "title" },
					{ name: "numberowned", value: "volume_list" }
				)
			)
		.addIntegerOption(option =>
			option.setName("page")
				.setDescription("Page to display")
				.setRequired(false)
				.setMinValue(1)
			)
		.addIntegerOption(option => 
			option.setName("displaylen")
				.setDescription("Number of series showed by page")
				.setRequired(false)
				.setMinValue(1)
			)
		.addBooleanOption(option =>
			option.setName("hide")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async execute(interaction) {
		const hide = interaction.options.getBoolean("hide") ?? false

		const db_userSeries = interaction.client.db.mirors.get("UserSeries");

		const res = await db_userSeries.toMessage(interaction.client.db.mirors, {
			page: (interaction.options.getInteger("page") ?? 1) - 1,
			field: interaction.options.getString("sortby"),
			displayLen: interaction.options.getInteger("displaylen"),
			coeficient: interaction.options.getInteger("sort"),
			userId: interaction.user.id
		});

		interaction.client.collectors.collectionPreviousCollector(interaction);
		interaction.client.collectors.collectionFolowingCollector(interaction);

		res.ephemeral = hide;
		await interaction.reply(res);
	}
}
