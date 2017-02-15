/**
 * main.js -- Program entry point.
 */

const DiscordJS = require('discord.js');
const Discord = new DiscordJS.Client();

const Reddit   = require('snoowrap');

const config  = require('./config.json');

global.config = config;

Discord.login(config.token);

Discord.on('ready', () => {
  console.log('Bot started.');
});

Discord.on('message', require('./lib/avoid5-discord.js').handleMessage);
