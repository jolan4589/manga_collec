/**
 * Get specified serie of user from userSeries
 * 
 * @param {Discord.userId} userId 
 * @param {String} title 
 * @param {Array<String>} [attributes] list of colunm to filter
 * 
 * @returns {Sequelize.Model}
 */
module.exports = async function (userId, title, attributes = {}) {
	return await (this.findOne({ where: { owner: userId, title:title }, attributes: attributes}));
}