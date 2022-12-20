const Sequelize = require("sequelize");

module.exports = {
	name: "Collections",
	async define(client) {
		return client.db.sequelize.define("Collections", {
			owner: {
				type: Sequelize.STRING,
				unique: true,
				primaryKey: true,
				allowNull: false,
			},
			total_manga: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		});
	}
}