const Sequelize = require("sequelize");

module.exports = {
	name: "UserSeries",
	async define(client) {
		return client.db.sequelize.define("UserSeries", {
			title: {
				type: Sequelize.STRING,
				unique: true,
				primaryKey: true,
			},
			owner: {
				type: Sequelize.STRING,
				unique: true,
				primaryKey: true,
			},
			volume_list: Sequelize.TEXT
		});
	}
}