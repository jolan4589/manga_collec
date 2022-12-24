
/**
 * Add new userSeries to the database.
 * 
 * WARNING : Series[title] and Collections[userId] must already exists
 * 
 * @param {Discord.userId} userId 
 * @param {String} title 
 * @param {String} [volume_list] define with volume_list
 * @returns 
 */
module.exports = async function (userId, title, volume_list = "") {	
	if (this.volume_list.isCorrect(volume_list)) {
		try {
			return await (this.create({
				owner: userId,
				title: title,
				volume_list: volume_list
			}));
		} catch (error) {
			return new Error(`Error, owner '${userId}' or serie '${title}' does not exist or this pair already exist.`);
		}
	} else {
		return new Error(`volume_list should only contain 'Number' and '[Number-Number]' separate by ',' and in ascending order.`);
	}
};
