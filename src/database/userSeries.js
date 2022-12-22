/********************************\
 * **************************** *
 * This file contain functions 	*
 * About UserSeries				*
 * **************************** *
\********************************/

const { Sequelize, Model } = require("sequelize");
const VList = require("./volume_list.js");

// Info : params starting by db_ refer about database content

/** 
 * @typedef {String} Discord.userId
 * @typedef {Model} Sequelize.Model
 */

/**
 * Return every row of specified user frrom userSeries
 * 
 * @param {Sequelize.Model} db_userSeries 
 * @param {Discord.userId} userId 
 * @param {Array<String>} [attributes] list of colunm to filter
 * 
 * @returns {Array<Model>} list of matching userSeries
 */
async function getUserSeries(db_userSeries, userId, attributes = {}) {
	return await (db_userSeries.findAll({ where: { owner: userId }, attributes: attributes }));
}

/**
 * Get specified serie of user from userSeries
 * 
 * @param {Sequelize.Model} db_userSeries 
 * @param {Discord.userId} userId 
 * @param {String} title 
 * @param {Array<String>} [attributes] list of colunm to filter
 * 
 * @returns {Sequelize.Model}
 */
async function getUserSerieByName(db_userSeries, userId, title, attributes = {}) {
	return await (db_userSeries.findOne({ where: { owner: userId, title:title }, attributes: {}}));
}

/**
 * Add new userSeries to the database.
 * 
 * WARNING : Series[title] and Collections[userId] must already exists
 * 
 * @param {Sequelize.Model} db_userSeries 
 * @param {Discord.userId} userId 
 * @param {String} title 
 * @param {String} [volume_list] define with volume_list
 * @returns 
 */
async function addUserSerie(db_userSeries, userId, title, volume_list = "") {
	if (VList.isCorrectVolume_list(volume_list)) {
		try {
			return await (db_userSeries.create({
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
}

/**
 * Add a volume into a userSerie
 * 
 * Warning : Does NOT support volume_list format.
 * 
 * @param {Sequelize.Model} db_userSeries 
 * @param {Discord.userId} userId 
 * @param {String} title 
 * @param {String} volume 
 */
async function addVolumeToUserSerie(db_userSeries, userId, title, volume) {
	const userSerie = await db_userSeries.findOne({ where: { owner: userId, title:title } });
	let res;

	if (userSerie) {
		userSerie.set({ volume_list: VList.insertVolumToList(volume, userSerie.volume_list) });

		await userSerie.save();
		res = `Volume ${volume} succesfully added to your serie ${title}`;
	} else {
		res = await addUserSerie(db_userSeries, userId, title, volume);
	}
	return res;
}

module.exports = {
	getUserSeries,
	getUserSerieByName,
	addUserSerie,
	addVolumeToUserSerie
}