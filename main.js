const Discord = require('discord.js');
const client  = new Discord.Client();
const config  = require('./config.json');

client.login(config.token);

client.on('ready', () => {
  console.log('Bot started.');
});

client.on('message', message => {
  if (message.author.bot || message.channel.id == '280536335536881664') {
    return;
  }
  var stripped = stripURLs(message.content);
  var fifthglyphs = detectFifthGlyphs(stripped);
  if (fifthglyphs.totalCount > 8 || fifthglyphs.longestRun > 2 || fifthglyphs.bold) {  
    message.channel.sendMessage('Too many fifthglyphs, or a bold glyph. Auto-kick.');
    message.author.send('Too many fifthglyphs, or a bold glyph. Auto-kick.');
    client.channels.get('280536335536881664').sendMessage(message.author + ' was kicked.');
    message.member.kick();
    return;
  }
  if (fifthglyphs.totalCount > 0 && !message.content.match(/@(?:here|everyone)/i)) {
    message.reply('fifthglyph found: ' + replaceFifthGlyphs(stripped));
  }
});

function stripURLs(text) {
  const regexURL = /[a-z][\da-z+.-]*:\/\/(?:[\da-z._~%!$&'(*+,;=:@\/?-]|\)(?!\s))+/ig;
  return text.replace(regexURL, '[link]');
}

function detectFifthGlyphs(text) {
  const regex = /(\*\*)?[eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэEĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€]+(\*\*)?/g;
  var matches = text.match(regex) || [];
  var counts = matches.map(x => x.replace(/\*/g, '').length);
  return {
    totalCount: counts.reduce(function(a,b) { return a + b }, 0),
    longestRun: Math.max.apply(null, counts),
    bold: matches.filter(x => x.startsWith('*')).length > 0
  }
}

function replaceFifthGlyphs(text) {
  const regexSmall = /[eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэ]/g;
  const regexLarge = /[EĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€]/g;
  return text.replace(regexSmall, '■').replace(regexLarge, '█');
}


