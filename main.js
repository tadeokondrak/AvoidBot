/**
 * main.js -- Program entry point.
 */

const DiscordJS     = require('discord.js');
const snoowrap      = require('snoowrap');
const snoostorm     = require('snoostorm');
const config        = require('./config.json');
const avoid5discord = require('./lib/avoid5-discord.js')
const avoid5reddit  = require('./lib/avoid5-reddit.js')
const Discord       = new DiscordJS.Client();
const Reddit        = new snoowrap(config.reddit.credentials);
const RedditStream  = new snoostorm(Reddit);

global.config = config;

Discord.login(config.discord.token);

Discord.on('ready', () => {
  console.log('Bot started.');
});

Discord.on('message', avoid5discord.handleMessage);

var commentStream = RedditStream.CommentStream({
  "subreddit": config.reddit.subreddit,
  "results": 5,
  "pollTime": 2000
});

var submissionStream = RedditStream.SubmissionStream({
  "subreddit": config.reddit.subreddit,
  "results": 5
});

commentStream.on("comment", function(post) {
  avoid5reddit.handlePost(post, 'comment');
});

submissionStream.on("submission", function(post) {
  avoid5reddit.handlePost(post, 'submission');
});
