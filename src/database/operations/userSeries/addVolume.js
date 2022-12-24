/**
 * Add a volume into a userSerie
 * 
 * Warning : Does NOT support volume_list format.
 * 
 * @param {Discord.userId} userId 
 * @param {String} title 
 * @param {String} volume 
 */
module.exports = async function(userId, title, volume) {
	const userSerie = await this.findOne({ where: { owner: userId, title:title } });
	let res;

	if (userSerie) {
		userSerie.set({ volume_list: this.volume_list.insertVolume(volume, userSerie.volume_list) });

		await userSerie.save();
		res = `Volume ${volume} successfully added to your serie ${title}`;
	} else {
		res = await create(this, userId, title, volume);
	}
	return res;
};
