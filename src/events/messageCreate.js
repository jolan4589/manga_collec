module.exports = {
	name: "messageCreate",
	once: false,
	async execute(message) {
		if (!message.author.bot) {
			message.reply("YEP");
		}
	}
};