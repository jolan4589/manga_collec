const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName("addserie")
		.setDescription("Create or update a Serie in database")
		.addStringOption(option =>
			option.setName("title")
				.setDescription("Name of the serie")
				.setRequired(true)
				.setMinLength(1)
			)
		.addStringOption(option =>
				option.setName("author")
					.setDescription("Name of the athor")
					.setRequired(false)
			)
		.addStringOption(option =>
				option.setName("editor")
					.setDescription("Name of the editor")
					.setRequired(false)
			)
		.addStringOption(option =>
				option.setName("summary")
					.setDescription("Synopsys")
					.setRequired(false)
			)
		.addIntegerOption(option =>
			option.setName("volumes")
				.setDescription("volume_list of the serie")
				.setRequired(false)
			)
		.addBooleanOption(option =>
			option.setName("complete")
				.setDescription("Is the series compelted ?")
				.setRequired(false)
			)
		.addBooleanOption(option =>
			option.setName("hide")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async execute(interaction) {
		const Series = interaction.client.db.mirors.get("Series");
		const title = interaction.options.getString("title").toLowerCase();
		const editor = interaction.options.getString("editor");
		const author = interaction.options.getString("author");
		const inShort = interaction.options.getString("inShort");
		const volumes = interaction.options.getInteger("volumes");
		const complete = interaction.options.getBoolean("complete");
		const hide = interaction.options.getBoolean("hide");
		const serie = await Series.findOrCreate({
			where: { title: title },
			default: {
				editor: "",
				author: "",
				in_short: "",
				ended: false,
				volume_number: 0
			}
		})

		const itFields = Object.entries({author: author, editor:editor, in_short: inShort, volume_number: volumes, ended: complete});

		for (const [key, val] of itFields) {
			if (val) {
				serie[key] = val;
			};
		}
		await serie.save();

		let message = interaction.client.db.serieToString(serie);
		message.ephemeral = hide;

		await interaction.reply(message);
	}
}
