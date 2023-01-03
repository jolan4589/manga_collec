const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

/**
 * Create and return ShowEmbed template
 * @param {Number} page 
 * @param {Number} total_pages 
 * @param {Boolean} isEntireCollection
 * 
 * @returns {Discord.Embed}
 */
function createEmbed(page, total_pages) {
	const embed = new EmbedBuilder()
		.setTitle("Your collection :")
		.setDescription(`${total_pages == 1 ? "This is your entire collection" : "This is a part of your collection, use :\n:arrow_left: :arrow_right: to change pages."}`)
	if (total_pages > 1)
		embed.setFooter({text: `page ${page + 1}/${total_pages}`})

	return(embed);
}

/**
 * Return a Discord row component with two butons
 * 
 * @returns {Discord.Component}
 */
function createButtons() {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId("collectionPrevious")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("⬅️")
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId("collectionFolowing")
				.setStyle(ButtonStyle.Primary)
				.setEmoji("➡️")
		)

	return [row];
}

function successEmbed(options) {
	let {
		page: page = 1,
		displayLen : displayLen = 15,
		series: series = []
	} = options;
	displayLen = displayLen ?? 15;
	const totalPages = Math.ceil(series.length / displayLen)

	while (page < 0) {
		page = totalPages + page;
	}
	page = page % totalPages;

	let embed = createEmbed(page, totalPages);
	const firstValue = page * displayLen;
	let lastValue = firstValue + displayLen;

	if (lastValue >= series.length) {
		lastValue = series.length;
	}

	for (let i = firstValue; i < lastValue; i++) {
		embed.addFields({ name : series[i].title, value: series[i].volume_list });
	}

	let embeds = [ embed.data ];
	return embeds;
}

function succesContent(user_collection) {
	return `your collection containe : ${user_collection.total_books} books.`
}

module.exports = async function (mirors, options) {
	const {
		field: field = undefined,
		coeficient: coeficient = 0,
		userId: userId = undefined,
		update: update = false
	} = options;
	let message = {};
	const db_userSeries = mirors.get("UserSeries");
	const db_collections = mirors.get("Collections");

	try {
		const userSeries = await db_userSeries.getAll(userId);
		if (userSeries.length) {
			options.series = field ? userSeries.sort((a, b) => {
				const resop = field == "volume_list" ? db_userSeries.volume_list.compare(a.volume_list, b.volume_list) : (a[field] < b[field]);
				return coeficient * (resop ? -1 : 1);
			}) : userSeries;
			message.embeds = successEmbed(options);

			const user_collection = await db_collections.findByPk(userId);

			if (update) {
				user_collection.total_books = options.series.reduce(
					(accumulator, currentValue) => accumulator + db_userSeries.volume_list.countTotalVolume(currentValue.volume_list),
					0
				)
			}
			message.content = succesContent(user_collection);

			if (message.embeds[0].footer) message.components = createButtons();
		} else {
			message = {content: "Sorry, you have no serie."}
		}
	} catch (error) {
		message = {content: "An error as occured"};
		console.log(error);
	}

	return message;
}