'use strict';

/* eslint-env node, mocha */
/* global sinon, expect */
const avoid5reddit = require('../lib/avoid5-reddit.js');

describe('avoid5-reddit.handlePost', function () {
  let sandbox, post, type;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    post = {
      subreddit: { banUser: sinon.spy() },
      assignFlair: sinon.spy(),
      reply: sinon.spy(),
      author: { name: 'ARedditUser' },
      title: 'titl'
    };
    global.config = {
      reddit: {
        credentials: {
          username: 'AvoidBot'
        }
      }
    };
  });
  afterEach(function () {
    sandbox.restore();
    global.config = null;
  });
  context('submission:', function () {
    beforeEach(function () {
      type = 'submission';
    });

    it('does nothing when the message is from itself', function () {
      post.author.name = 'AvoidBot';
      post.selftext = 'Ee.';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    it('does nothing when the post contains no fifthglyphs', function () {
      post.selftext = 'That quick brown fox was jumping across that lazy dog.';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    it('does nothing when the post contains a link with fifthglyphs', function () {
      post.selftext = 'A filthy link: eee://eeeee.ee/eeee';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    it('does nothing when the post contains mentions with fifthglyphs', function () {
      post.selftext = 'blah /u/test u/test /u/TEST u/TEST /u/te_st u/te_st blah';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    const scenarios = [
      { description: 'more fifthglyphs than the threshold', text: Array(40).join('e') + 'aaaaaaa' },
      { description: 'a long run of fifthglyphs', text: 'Eeek!' },
      { description: 'specifically bolded fifthglyphs', text: '**Ee**k!' }
    ];

    scenarios.forEach(function (scenario) {
      context('when the post has ' + scenario.description, function () {
        beforeEach(function () {
          post.selftext = scenario.text;
          avoid5reddit.handlePost(post, type);
        });
        it('bans the user', function () { expect(post.subreddit.banUser).to.have.been.called; });
        it('flairs the post', function () { expect(post.assignFlair).to.have.been.called; });
      });
    });

    it('replies to the post when the post has a few fifthglyphs', function () {
      post.selftext = 'A **few** accidental fifthglyphs.';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).to.have.been.calledWithMatch(/^Fifthglyphs found in your post:/i);
    });

    it('replies without any mentions included', function () {
      post.selftext = '/u/test u/test /u/TEST u/TEST /u/te_st u/te_st message';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).to.have.been.calledWithMatch(/^Fifthglyphs found in your post:[\s\S]*?m■ssag■/i);
    });
  });
  context('comment:', function () {
    beforeEach(function () {
      type = 'comment';
    });

    it('does nothing when the message is from itself', function () {
      post.author.name = 'AvoidBot';
      post.body = 'Ee.';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    it('does nothing when the post contains no fifthglyphs', function () {
      post.body = 'That quick brown fox was jumping across that lazy dog.';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    it('does nothing when the post contains a link with fifthglyphs', function () {
      post.body = 'A filthy link: eee://eeeee.ee/eeee';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    it('does nothing when the post contains mentions with fifthglyphs', function () {
      post.body = 'blah /u/test u/test /u/TEST u/TEST /u/te_st u/te_st blah';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).not.to.have.been.called;
    });

    const scenarios = [
      { description: 'more fifthglyphs than the threshold', text: Array(40).join('e') + 'aaaaaaa' },
      { description: 'a long run of fifthglyphs', text: 'Eeek!' },
      { description: 'specifically bolded fifthglyphs', text: '**Ee**k!' }
    ];

    scenarios.forEach(function (scenario) {
      context('when the post has ' + scenario.description, function () {
        beforeEach(function () {
          post.body = scenario.text;
          avoid5reddit.handlePost(post, type);
        });
        it('bans the user', function () { expect(post.subreddit.banUser).to.have.been.called; });
        it('flairs the post', function () { expect(post.reply).to.have.been.calledWithMatch(/^This individual/i); });
      });
    });

    it('replies to the post when the post has a few fifthglyphs', function () {
      post.body = 'A **few** accidental fifthglyphs.';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).to.have.been.calledWithMatch(/^Fifthglyphs found in your post:/i);
    });

    it('replies without any mentions included', function () {
      post.body = '/u/test u/test /u/TEST u/TEST /u/te_st u/te_st message';
      avoid5reddit.handlePost(post, type);
      expect(post.subreddit.banUser).not.to.have.been.called;
      expect(post.reply).to.have.been.calledWithMatch(/^Fifthglyphs found in your post:[\s\S]*?m■ssag■/i);
    });
  });
});

describe('avoid5-reddit.stripMentions', function () {
  const scenarios = ['/u/test', '/u/te_st', '/u/TEST', 'u/test', 'u/te_st', 'u/TEST'];
  scenarios.forEach(function (scenario) {
    let text = 'Before ' + scenario + ' After';
    context('when provided "' + scenario + '" as input', function () {
      let subject = avoid5reddit.stripMentions(text);
      it('removes the mention', function () { expect(subject).to.equal('Before After'); });
    });
  });
});
