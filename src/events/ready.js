module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		client.db.mirors.forEach(miror => {
			try {
				miror.sync();
			} catch (error) {
				console.log(error);
			}
		})
		console.log('MangaMan ready tu use.');
	}
}