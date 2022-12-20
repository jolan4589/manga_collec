module.exports = (client) => {
	client.eventsHandlers = async (eventFiles) => {
		for (let file of eventFiles) {
			const event = require(`../events/${file}`);
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args, client));
			} else {
				client.on(event.name, (...args) => event.execute(...args, client));
			}
		}
	};
}