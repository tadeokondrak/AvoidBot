/**
 * main.js -- Program entry point.
 */

const Discord = require('discord.js');
const client  = new Discord.Client();
const config  = require('./config.json');

client.login(config.token);

client.on('ready', () => {
  console.log('Bot started.');
});

client.on('message', require('./lib/avoid5-discord.js').handleMessage);
