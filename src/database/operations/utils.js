module.exports = function (client) {
	/**
	 * Create a new row from data to table Table
	 * 
	 * @param {String} table 
	 * @param {Object} data
	 * 
	 * @returns {Model | Error}
	 */
	client.db.insertInto = async function (table, data) {
		const miror = await this.mirors.get(table);
	
		if (!miror) {
			return new Error(`Table ${table} dosen't exists.`);
		}
	
		try {
			const elem = await miror.create(data);
			return elem;
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return new Error("That element already exists.");
			} else {
				return new Error(`Something went wrong with adding ${data} to ${table}.`);
			}
		} 
	}
};
