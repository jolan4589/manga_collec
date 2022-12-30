module.exports = (client) => {
	client.collectorsSetup = (collectorsFiles) => {
		client.collectors = {};

		for (const file of collectorsFiles) {
			const collector = require(`../collectors/${file}`);
			client.collectors[collector.name] = collector.execute;
		}
	}
}