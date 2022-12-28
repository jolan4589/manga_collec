const { SlashCommandBuilder, User } = require("discord.js");

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
		const mirors = interaction.client.db.mirors;
		const Collections = mirors.get("Collections");
		const Series = mirors.get("Series");
		const UserSeries = mirors.get("UserSeries");
		const bookname = interaction.options.getString("bookname").toLowerCase();
		const volumeToAdd = interaction.options.getString("number");
		let res;

		try {
			if (await Series.findByPk(bookname)) {
				const userId = interaction.user.id;
				const userCollection = await Collections.findByPk(userId);

				if (!userCollection) {
					await Collections.create({
						owner: userId,
						name: interaction.user.username
					})
				}

				const [userSerie, ] = await UserSeries.findOrCreate({
					where: { owner: userId, title: bookname },
					defaults: {
						volume_list: ""
					}
				});

				userSerie.volume_list = await UserSeries.volume_list.insertVolume(volumeToAdd, userSerie.volume_list);
				await userSerie.save({ fields: ['volume_list'] });
				res = `Your serie ${bookname} as been updated`;
			} else {
				res = `The series ${bookname} does not exist in our database. Contact support for add it`;
			}
		} catch (error) {
			if (error.name === "SequelizeUniqueConstraintError") {
				res = "That tag already exists.";
			} else {
				console.log(error)
				res = "Something went wrong with adding a tag.";
			}
		}

		await interaction.reply({content: res, ephemeral: interaction.options.getBoolean("hide")})
	}
}
