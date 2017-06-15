'use strict';

/* eslint-env node, mocha */
/* global sinon, expect */
const avoid5discord = require('../lib/avoid5-discord.js');

describe('avoid5-discord.handleMessage', function () {
  let sandbox, logChannel, message;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    global.config = {
      discord: {
        ignoredChannels: [ 'IGNORE' ],
        logChannel: 'LOGGING'
      }
    };
    logChannel = { sendMessage: sinon.spy() };
    message = {
      author: { bot: false, send: sinon.spy(), toString: () => 'AUTHOR' },
      channel: { id: 'TEST', sendMessage: sinon.spy() },
      member: { kick: sinon.spy() },
      reply: sinon.spy(),
      client: { channels: { get: function (id) { return logChannel; } } }
    };

    sinon.spy(message.client.channels, 'get');
  });
  afterEach(function () {
    global.config = null;
    sandbox.restore();
  });

  it('does nothing when the message is from a bot', function () {
    message.author.bot = true;
    message.content = 'Eek!';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).not.to.have.been.called;
  });

  it('does nothing when the message is from an ignored channel', function () {
    message.channel.id = 'IGNORE';
    message.content = 'Eek!';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).not.to.have.been.called;
  });

  it('does nothing when the message contains no fifthglyphs', function () {
    message.content = 'That quick brown fox was jumping across that lazy dog.';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).not.to.have.been.called;
  });

  it('does nothing when the message contains a link with fifthglyphs', function () {
    message.content = 'A filthy link: eee://eeeee.ee/eeee';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).not.to.have.been.called;
  });

  it('does nothing when the message contains mentions with fifthglyphs', function () {
    message.content = 'blah @here @everyone @here @everyone blah';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).not.to.have.been.called;
  });

  const scenarios = [
    { description: 'more fifthglyphs than the threshold', text: 'The speedy beige vulpine jumped over the sleeping canine.' },
    { description: 'a long run of fifthglyphs', text: 'Eeek!' },
    { description: 'specifically bolded fifthglyphs', text: '**Ee**k!' }
  ];

  scenarios.forEach(function (scenario) {
    context('when the message has ' + scenario.description, function () {
      beforeEach(function () {
        message.content = scenario.text;
        avoid5discord.handleMessage(message);
      });

      const response = /^Too many fifthglyphs, or a bold glyph. Auto-kick.$/i;

      it('messages the channel', function () {
        expect(message.channel.sendMessage).to.have.been.calledWithMatch(response);
      });
      it('messages the author', function () {
        expect(message.author.send).to.have.been.calledWithMatch(response);
      });
      it('logs the kick action', function () {
        expect(message.client.channels.get).to.have.been.calledWith('LOGGING');
        expect(logChannel.sendMessage).to.have.been.calledWithMatch(/^Kicking AUTHOR$/i);
      });
      it('kicks the user', function () { expect(message.member.kick).to.have.been.called; });
      it('does not reply to the message', function () { expect(message.reply).not.to.have.been.called; });
    });
  });

  it('replies to the message when the message has a few fifthglyphs', function () {
    message.content = 'A **few** accidental fifthglyphs.';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).to.have.been.calledWithMatch(/^fifthglyphs found:/i);
  });

  it('replies without any mentions included', function () {
    message.content = '@here @everyone <@1234567890><@!1234567890><#1234567890><@&1234567890><:emote:1234567890> message';
    avoid5discord.handleMessage(message);
    expect(message.member.kick).not.to.have.been.called;
    expect(message.reply).to.have.been.calledWithMatch(/^fifthglyphs found:\s*m■ssag■/i);
  });
});

describe('avoid5-discord.stripMentions', function () {
  const mentions = [ '@here', '@everyone', '<@1234567890>', '<@!1234567890>',
    '<#1234567890>', '<@&1234567890>', '<:emote:1234567890>' ];
  mentions.forEach(function (mention) {
    let text = 'Before ' + mention + ' After';
    context('when provided "' + text + '" as input', function () {
      let subject = avoid5discord.stripMentions(text);
      it('removes the mention', function () { expect(subject).to.equal('Before After'); });
    });
  });
});
