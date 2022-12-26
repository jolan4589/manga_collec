
/**
 * Calculate real page to show,
 * loop from 1 to total_pages.
 * 
 * If page is negativ, loop from total_pages to 1
 * @param {String | Number} page 
 * @param {Number} total_pages 
 * 
 * @returns {Number} included in [1..total_pages]
 */
function defineShowPage(page, options = {}) {

	page = parseInt(page);
	if (page == 0) {
		page = 1;
	} else if (page > 0) {
		page = ((page - 1) % total_pages) + 1;
	} else {
		page = total_pages + ((page + 1) % total_pages);
	}
	return page
}

/**
 * Create and return ShowEmbed template
 * @param {Number} page 
 * @param {Number} total_pages 
 * @param {Boolean} isEntireCollection
 * 
 * @returns {Discord.Embed}
 */
function createEmbed(page, total_pages) {
	return {
		title: `Your collection :`,
		description: `${total_pages == 1 ? "This is your entire collection" : "This is a part of your collection, use :\n:arrow_left: :arrow_right: to change pages."}`,
		fields: [],
		footer: {
			text: `page ${page + 1}/${total_pages}`
		}
	}
}

/**
 * Return a Discord row component with two butons
 * 
 * @returns {Discord.Component}
 */
function createButtons() {
	return {
		type: 1,
		components: [
			{
				"type": 2,
				"style": 1,
				"custom_id": "click_one",
				"emoji": "⬅️"
			},
			{
				"type": 2,
				"style": 1,
				"custom_id": "click_two",
				"emoji": "➡️"
			}
		]
	}
}

module.exports = function (userSeries, options) {
	let {
		page: page = 1,
		displayLen: displayLen = 1
	} = options;

	const totalPages =  Math.ceil(userSeries.length / displayLen)
	page = page % totalPages;

	let embed = createEmbed(page, totalPages);
	const firstValue = page * displayLen;
	let lastValue = firstValue + displayLen;

	if (lastValue >= userSeries.length) {
		lastValue = userSeries.length;
	}
	for (let i = firstValue; i < lastValue; i++) {
		embed.fields.push({ name : userSeries[i].title, value: userSeries[i].volume_list });
	}

	let message = { content: "Salut", embeds: [ embed ] };
	if (totalPages > 1) {
		message.components = [ createButtons() ];
	}

	return message;
}