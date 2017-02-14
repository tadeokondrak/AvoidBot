/**
 * main.js -- Program entry point.
 */

const Discord = require('discord.js');
const client  = new Discord.Client();
const config  = require('./config.json');
const regex = /(\*\*)?[eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэEĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€]+\1?/g;
const regexSmall = /[eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэ]/g
const regexLarge = /[EĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€]/g;
const regexURL = /[a-z][\da-z+.-]*:\/\/(?:[\da-z._~%!$&'(*+,;=:@\/?-]|\)(?!\s))+/ig;
const regexDiscord = /@here|@everyone/g
client.login(config.token);

client.on('ready', () => {
  console.log('Bot started.');
});

client.on('message', require('./lib/avoid5-discord.js').handleMessage);