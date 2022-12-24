/**
 * Return every row of specified user frrom userSeries
 * 
 * @param {Discord.userId} userId 
 * @param {Array<String>} [attributes] list of colunm to filter
 * 
 * @returns {Array<Model>} list of matching userSeries
 */
module.exports = async function (userId, attributes = {}) {
	return await (this.findAll({ where: { owner: userId }, attributes: attributes }));
}
