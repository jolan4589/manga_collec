const Sequelize = require("sequelize");

module.exports = {
	name: "Test",
	/*
	* equivalent to: CREATE TABLE tags(
	* name VARCHAR(255) UNIQUE,
	* description TEXT,
	* username VARCHAR(255),
	* usage_count  INT NOT NULL DEFAULT 0
	* );
	*/
	async define(client) {
		return client.db.sequelize.define("tags", {
			name: {
				type: Sequelize.STRING,
				unique: true,
			},
			description: Sequelize.TEXT,
			username: Sequelize.STRING,
			usage_count: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		});
	}
}