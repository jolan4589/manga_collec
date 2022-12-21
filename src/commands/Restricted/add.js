const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	global: false,
	data: new SlashCommandBuilder()
		.setName("add")
		.setDescription("Add a book to your personal collection.")
		.addStringOption(option =>
			option.setName('bookname')
				.setDescription('Title of the book.')
				.setRequired(true)
			)
		.addStringOption(option =>
			option.setName('number')
				.setDescription('Tome number')
				.setRequired(true)
			)
		.addBooleanOption(option =>
			option.setName("hide")
				.setDescription("True for hide response.")
				.setRequired(false)
			),
	async execute(interaction) {
		try {
			const mirors = interaction.client.db.miros;
			const Collections = mirors.get("Collections");
			const Series = mirors.get("Series");
			const bookname = interaction.options.getString("bookname");

			if (await Series.findByPk(bookname.toLowerCase())) {
				const userId = interaction.user.id;
				const userCollection = Collections.findByPk(userId);

				if (!userCollection) {
					await Collections.create({
						owner: userId,
						name: interaction.user.username
					})
				}
			} else {
				await interaction.reply(`The series ${bookname} does not exist in our database. Contact support for addit`)
			}

			if (!mirors.get("Collections").findByPk(interaction.user.id)) {
				mirors.get("Collection")
			}
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
