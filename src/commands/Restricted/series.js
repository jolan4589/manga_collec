const { SlashCommandBuilder, GuildVerificationLevel } = require("discord.js");

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName("series")
		.setDescription("Show all listed series.")
		.addStringOption(option =>
			option.setName("title")
				.setDescription("title filter")
				.setRequired(false)
				.setAutocomplete(true)
			)
		.addBooleanOption(option =>
			option.setName("detailed")
				.setDescription("True show all series field, serie by serie")
				.setRequired(false)
			)
		.addBooleanOption(option =>
			option.setName("hide")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const series = await interaction.client.db.mirors.get("Series").findAll();
		const titles = series.map(val => val.title);
		const reg = new RegExp(`.*${focusedValue.split("").join(".*")}.*`, "ig");
		const filtered = titles.filter(title => title.match(reg));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
		const reg = new RegExp((interaction.options.getString("title") ?? "").split("").join(".*"), "ig");
		const hide = interaction.options.getBoolean("hide") ?? false;
		const series = (await interaction.client.db.mirors.get("Series").findAll()).filter(serie => serie.title.match(reg));
		let message;

		if (series.length > 0) {

			let fields = [];
			for (const serie of series) {
				fields.push({name: serie.title, value: `${serie.ended ? "complted in" : "Still in progress with"} ${serie.volume_number} volumes.`});
			}

			message = {
				embeds: [{
					name: "Finded series",
					fields: fields
				}],
				ephemeral: hide
			};
		} else {
			message = {content: `No serie found for : ${interaction.options.getString("title")}`};
		}
		await interaction.reply(message);
	}
}
