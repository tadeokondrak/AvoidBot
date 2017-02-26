'use strict';

/* eslint-env node, mocha */
/* global expect */
var avoid5 = require('../lib/avoid5.js');

describe('avoid5.detect', function () {
  const fifthglyphs = 'eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэEĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€';

  const scenarios = [
    { text: 'no fifthglyphs', expected: { count: 0, longestRun: 0, bolded: false } },
    { text: 'just one fifthglyph', expected: { count: 1, longestRun: 1, bolded: false } },
    { text: 'unbolded and bold**e**d fifthglyphs', expected: { count: 2, longestRun: 1, bolded: true } },
    { text: 'runs eEe of EeEeEe fifthglyphs', expected: { count: 9, longestRun: 6, bolded: false } },
    { text: 'bolded **eEeEe** run', expected: { count: 6, longestRun: 5, bolded: true } },
    { text: 'und__e__rscored bold', expected: { count: 2, longestRun: 1, bolded: true } },
    { text: 'bold italic **_e_**', expected: { count: 1, longestRun: 1, bolded: true } },
    { text: 'all fifthglyphs: ' + fifthglyphs, expected: { count: fifthglyphs.length, longestRun: fifthglyphs.length, bolded: false } }
  ];

  scenarios.forEach(function (scenario) {
    context('when provided "' + scenario.text + '" as input', function () {
      let subject = avoid5.detect(scenario.text);
      it('counts ' + scenario.expected.count + ' fifthglyph(s)', function () {
        expect(subject.count).to.equal(scenario.expected.count);
      });
      it('finds a run of ' + scenario.expected.longestRun + ' fifthglyph(s)', function () {
        expect(subject.longestRun).to.equal(scenario.expected.longestRun);
      });
      it('reports fifthglyphs ' + (scenario.expected.bolded ? 'are' : 'are not') + ' bolded', function () {
        expect(subject.bolded).to.equal(scenario.expected.bolded);
      });
    });
  });
});

describe('avoid5.mask', function () {
  const lowercase = 'eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэ';
  const uppercase = 'EĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€';
  const lowermask = '■';
  const uppermask = '█';

  it('hides any fifthglyphs that appear in the text', function () {
    expect(avoid5.mask('Example text.')).to.be.eq('█xampl■ t■xt.');
  });

  it('hides all lowercase fifthglyphs', function () {
    expect(avoid5.mask(lowercase)).to.be.eq(lowermask.repeat(lowercase.length));
  });

  it('hides all uppercase fifthglyphs', function () {
    expect(avoid5.mask(uppercase)).to.be.eq(uppermask.repeat(uppercase.length));
  });
});

describe('avoid5.stripLinks', function () {
  const links = [
    'https://www.reddit.com/AVoid5/',
    'https://151.101.65.140/%41%56%6F%69%64%35%2F',
    'generic-scheme://user@example.host/path/to/file(name).ext?query=123#fragment'
  ];
  const scenarios = [
    'BEFORE [link] AFTER',
    'BEFORE <a href="[link]">HTML-style</a> AFTER',
    'BEFORE [Markdown-style]([link]) AFTER'
  ];

  scenarios.forEach(function (scenario) {
    links.forEach(function (link) {
      let text = scenario.replace('[link]', link);
      context('when provided "' + text + '" as input', function () {
        let subject = avoid5.stripLinks(text);
        it('removes the link', function () { expect(subject).to.equal(scenario); });
      });
    });
  });
});

describe('avoid5.splitMessage', function () {
  const scenarios = [
    {input: 'Word1 word2 ■word3 word4 word5 word6', result: ['word2 ■word3 word4']},
    {input: '█word1 word2 word3.', result: ['█word1 word2']},
    {input: '█word1 ■word2 ■word3', result: ['█word1 ■word2 ■word3']},
    {input: '█word1 word2 ■word3 word4 word5', result: ['█word1 word2', '■word3 word4']},
    {input: 'word1 word2 word3', result: null}
  ];
  scenarios.forEach(function (scenario) {
    let text = scenario.input;
    context('when provided "' + text + '" as input', function () {
      it('splits the message correctly', function () {
        expect(avoid5.splitMessage(scenario.input)).to.deep.equal(scenario.result);
      });
    });
  });
});
