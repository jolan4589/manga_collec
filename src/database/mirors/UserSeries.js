const Sequelize = require("sequelize");

module.exports = {
	name: "UserSeries",
	async define(client) {
		return client.db.sequelize.define("UserSeries", {
			title: {
				type: Sequelize.STRING,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "Series",
					key: "title"
				}
			},
			owner: {
				type: Sequelize.STRING,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "Collections",
					key: "owner"
				}
			},
			volume_list: {
				type: Sequelize.TEXT,
				allowNull: false,
				defaultValue: ""
			}
		});
	}
}