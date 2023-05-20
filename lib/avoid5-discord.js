'use strict';

/* global config */
/**
 * avoid5-discord.js -- Discord-specific handlers.
 */

const avoid5 = require('./avoid5.js');
/**
 * Handles the specified Discord message.
 *
 * @param message   The message from the Discord server.
 */
exports.handleMessage = message => {
  if (message.author.bot || config.discord.ignoredChannels.includes(message.channel.id)) {
    return;
  }

  var stripped = stripMentions(avoid5.stripLinks(message.content));
  var results = avoid5.detect(stripped);
  if (results.count >= 8 || results.longestRun >= 3 || results.bolded) {
    const response = 'Too many fifthglyphs, or a bold glyph. Auto-kick.';
    message.channel.sendMessage(response);
    message.author.send(response);
    message.client.channels.get(config.discord.logChannel).sendMessage('Kicking ' + message.author);
    if (message.member) {
      message.member.kick();
    }
  } else if (results.count === 1) {
    message.reply('fifthglyph found: ' + avoid5.splitMessage(avoid5.mask(stripped)).join(', '));
  } else if (results.count > 1) {
    message.reply('fifthglyphs found: ' + avoid5.splitMessage(avoid5.mask(stripped)).join(', '));
  }
};

/**
 * Removes Discord-style mentions from the specified text.
 *
 * @param text  The text from which to remove mentions.
 */
const stripMentions = function (text) {
  const regex = /\s*(?:@(?:here|everyone)|<(?:@[!&]?|#|:.*?:)\d+>)\s*/ig;
  return text.replace(regex, ' ');
};
exports.stripMentions = stripMentions;
