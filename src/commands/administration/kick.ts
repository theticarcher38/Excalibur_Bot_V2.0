import { SlashCommandBuilder } from "../../exports";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user'),
    async execute(interaction: { reply: (arg0: string) => any }) {
        await interaction.reply('user kicked')
    }
}