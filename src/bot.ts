import { console } from 'terminal-styling';
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config({ path: "./config/.env" });
const token = process.env.TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

fs.readdirSync('./commands/').forEach((dir: any) => {
    const commandFiles = fs.readdirSync(`./commands/${dir}`).filter((file: string) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        client.commands.set(command.data.name, command);
    }
})


client.once('ready', () => {
    console.info(`${client.user.tag} is now online`);
    client.user.setActivity('Under Development', {type: 'PLAYING'})
});

client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.err(err);
        await interaction.reply( { content: 'There was an error while executing this command!', ephemeral: true});
    }

});

client.login(token);