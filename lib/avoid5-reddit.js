'use strict';

/* global config */
/**
 * avoid5-reddit.js -- Reddit-specific handlers.
 */

const avoid5 = require('./avoid5.js');
/**
 * Handles the specified Reddit post.
 *
 * @param message   The message from the Reddit post.
 */
const handlePost = function (post, type) {
  if (post.author.name === config.reddit.credentials.username) {
    return;
  }
  var postText;
  if (type === 'submission') {
    postText = post.title + '\n\n' + post.selftext;
  } else if (type === 'comment') {
    postText = post.body;
  }
  var results = avoid5.detect(stripMentions(avoid5.stripLinks(postText)));
  if ((results.count / postText.length > 0.75 && postText.length >= 50) || results.longestRun >= 3) {
    ban(post, type, 'Too many fifthglyphs');
    return;
  } else if (results.bolded) {
    ban(post, type, 'Fifthglyph in bold');
    return;
  }
  if (results.count === 1) {
    post.reply('A fifthglyph was found in your post: \n>' + quote(avoid5.splitMessage(avoid5.mask(stripMentions(avoid5.stripLinks(postText)))).join('\n')));
  } else if (results.count > 1) {
    post.reply('Fifthglyphs found in your post: \n>' + quote(avoid5.splitMessage(avoid5.mask(stripMentions(avoid5.stripLinks(postText)))).join('\n')));
  }
};
 /**
  * Bans the user, and replies or flairs the post.
  *
  * @param post    Post to ban
  * @param type    Type of post
  * @param reason  Reason to ban
  */
const ban = function (post, type, reason) {
  if (type === 'submission') {
    post.assignFlair({text: 'BAN', cssClass: 'ban'});
    post.subreddit.banUser({name: post.author});
  } else if (type === 'comment') {
    post.reply('This individual got a ban for this post. (' + reason + ')');
    post.subreddit.banUser({name: post.author});
  }
};

/**
 * Removes Reddit-style mentions from the specified text.
 *
 * @param text  The text from which to remove mentions.
 */
const stripMentions = function (text) {
  //  const regex = /\/u\/[A-z-_0-9]+/gi;
  const regex = /\s*\/?u\/[\da-z_-]+\s*/ig;
  return text.replace(regex, ' ');
};

 /**
  * Does a Markdown quote on all the lines.
  *
  * @param text  The text to qote.
  */
const quote = function (text) {
  const regex = /\r?\n|\r/g;
  return text.replace(regex, '\n\n>');
};

exports.stripMentions = stripMentions;
exports.handlePost = handlePost;
