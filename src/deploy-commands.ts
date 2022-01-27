import { console } from 'terminal-styling';
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
dotenv.config({ path: "./config/.env" });
const config = require('./config/config.json');
const ascii = require('ascii-table')

let table_development = new ascii('Development Commands');
let table_build = new ascii('Build Commands')
table_development.setHeading("Name", "Module", "Description", "Options", "Permissions");
table_build.setHeading("Name", "module", "Description", "Options", "Permissions");

const clientId = config.CLIENT_ID;
const guildId = config.GUILD_ID;
const token = process.env.TOKEN;

const commands: any[] = []

fs.readdirSync('./commands/').forEach((dir: any) => {
    const commandFiles = fs.readdirSync(`./commands/${dir}`).filter((file: string) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        // console.info(`${file.replace(/\.[^/.]+$/, "")} of ${dir} successfully registered.`);
        commands.push(command.data.toJSON());
            table_development.addRow(command.data.name.toUpperCase(), dir.toUpperCase(), command.data.description, command.data.options, command.data.permissions);
            table_build.addRow(command.data.name.toUpperCase(), dir.toUpperCase(), command.data.description, command.data.options, command.data.permissions);
    }
})


const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        if (!guildId) {
            await rest.put(
                Routes.applicationCommands(clientId), {
                    body: commands
                },
            );
            console.info(table_build.toString());
        } else {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId), {
                    body: commands
                },
            );
            console.info(table_development.toString());
        }
    } catch (err) {
        if (err) console.err(err);
    }
})();