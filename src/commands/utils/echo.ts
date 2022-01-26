import { SlashCommandBuilder } from "../../exports";
import { console } from 'terminal-styling';
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with user input')
        .addStringOption((option: { setName: (arg0: string) => any; }) =>
            option.setName('input-string')
                .setDescription('The input to echo back')
                .setRequired(true)),
        
    async execute(interaction: any) {
        const input = interaction.options.getString('input-string');
        let embed = new MessageEmbed()
            .setTitle('Echo')
            .setAuthor(interaction.member.displayName)
            .addField('Message:', `${input}`)
            .setTimestamp()
        try {
            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.err(`[ErrorLogs] ${err}`)
        }
    }
}