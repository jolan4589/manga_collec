module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (command) {
				try {
					await command.execute(interaction);
				} catch (error) {
					console.log(error);
					await interaction.reply({
						conent: `An error occured during ${command} execution.`,
						exphemeral: true
					})
				}
			}
		}
	}
};
