import { console } from 'terminal-styling';
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
dotenv.config({ path: "./config/.env" });

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands: any[] = []

fs.readdirSync('./commands/').forEach((dir: any) => {
    const commandFiles = fs.readdirSync(`./commands/${dir}`).filter((file: string) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        console.info(`${file.replace(/\.[^/.]+$/, "")} of ${dir} successfully registered.`);
        commands.push(command.data.toJSON());
    }
})


const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.info(`[RegistryLogs] All commands successfully registered.`))
    .catch(console.err);