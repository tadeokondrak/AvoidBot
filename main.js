'use strict';

/**
 * main.js -- Program entry point.
 */

require('dotenv').config()

const config = {
    discord: {
        token: process.env.AVOIDBOT_DISCORD_TOKEN || "",
        ignoredChannels: (process.env.AVOIDBOT_DISCORD_IGNORED_CHANNELS || "").split(":"),
        logChannel: process.env.AVOIDBOT_DISCORD_LOG_CHANNEL || ""
    },
    reddit: {
        credentials: {
            userAgent: process.env.AVOIDBOT_REDDIT_USER_AGENT || "",
            clientId: process.env.AVOIDBOT_REDDIT_CLIENT_ID || "",
            clientSecret: process.env.AVOIDBOT_REDDIT_CLIENT_SECRET || "",
            username: process.env.AVOIDBOT_REDDIT_USERNAME || "",
            password: process.env.AVOIDBOT_REDDIT_PASSWORD || ""
        },
        subreddit: process.env.AVOIDBOT_REDDIT_SUBREDDIT || ""
    }
}

const DiscordJS = require('discord.js');
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const avoid5discord = require('./lib/avoid5-discord.js');
const avoid5reddit = require('./lib/avoid5-reddit.js');
const Discord = new DiscordJS.Client();
const Reddit = new Snoowrap(config.reddit.credentials);
const RedditStream = new Snoostorm(Reddit);

global.config = config;

Discord.login(config.discord.token);

Discord.on('ready', () => {
  console.log('Bot started.');
});

Discord.on('message', avoid5discord.handleMessage);

Discord.on('messageUpdate', (oldMessage, newMessage) => {
  avoid5discord.handleMessage(newMessage);
});

var commentStream = RedditStream.CommentStream({
  'subreddit': config.reddit.subreddit,
  'results': 10,
  'pollTime': 5000
});

var submissionStream = RedditStream.SubmissionStream({
  'subreddit': config.reddit.subreddit,
  'results': 10,
  'pollTime': 5000
});

commentStream.on('comment', function (post) {
  avoid5reddit.handlePost(post, 'comment');
});

submissionStream.on('submission', function (post) {
  avoid5reddit.handlePost(post, 'submission');
});
