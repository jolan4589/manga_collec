const Sequelize = require("sequelize");

module.exports = {
	name: "Series",
	async define(client) {
		return client.db.sequelize.define("Series", {
			title: {
				type: Sequelize.STRING,
				unique: true,
				primaryKey: true,
				allowNull: false,
			},
			author: Sequelize.STRING,
			editor: Sequelize.STRING,
			in_short: Sequelize.TEXT,
			ended: Sequelize.BOOLEAN,
			volume_number: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			}
		});
	}
}
