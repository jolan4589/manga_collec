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

		const field = interaction.options.getString("sortby");
		const coeficient = interaction.options.getInteger("sort") ?? 0;
		const db_userSeries = interaction.client.db.mirors.get("UserSeries");
		const page = (interaction.options.getInteger("page") ?? 1) - 1;
		const displayLen = interaction.options.getInteger("displaylen") ?? 15;
		let res;

		try {
			const userSeries = await db_userSeries.getAll(interaction.user.id);
			if (userSeries.length) {
				const sortedSeries = field ? userSeries.sort((a, b) => {
					const resop = field == "volume_list" ? db_userSeries.volume_list.compare(a.volume_list, b.volume_list) : (a[field] < b[field]);
					return coeficient * (resop ? -1 : 1);
				}) : userSeries;
				res = db_userSeries.toMessage(sortedSeries, { page: page, displayLen: displayLen });
			} else {
				res = {content: "Sorry, you dont have database."}
			}
		} catch (error) {
			res = {content: "An error as occured"};
			console.log(error);
		}

		res.ephemeral = hide;
		await interaction.reply(res);
	}
}
