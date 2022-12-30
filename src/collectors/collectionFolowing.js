module.exports = {
	name: "collectionFolowingCollector",
	async execute(interaction) {
		const filter = i => i.customId === "collectionFolowing" && i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, idle: 60000, dispose: true });

		collector.on("collect", async i => {

			const res = await interaction.client.db.mirors.get("UserSeries").toMessage(interaction.client.db.mirors, {
				page: parseInt(i.message.embeds[0].footer.text.slice(5).split("/")),
				field: interaction.options.getString("sortby"),
				displayLen: interaction.options.getInteger("displaylen"),
				coeficient: interaction.options.getInteger("sort"),
				userId: interaction.user.id
			});

			await i.update({ embeds: res.embeds });
		});
		//collector.on("end", collected => console.log(`Collected ${collected.size} items`));
	}
}