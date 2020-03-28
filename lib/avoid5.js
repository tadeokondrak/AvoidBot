'use strict';

/**
 * avoid5.js -- Support library for avoiding fifthglyphs.
 */

const fs = require('fs');

var cachedFifthglyphs = null;
var cachedRegex = {};

const loadFifthglyphs = function () {
  return fs.readFileSync('./lib/data/fifthglyphs.txt').toString()
    .replace(/#[^\r\n]*/g, '').split(/\s+/g).filter(x => x.length > 0);
};

/**
 * Returns an array with all characters to be treated as fifthglyphs.
 */
const fifthglyphs = function () {
  return cachedFifthglyphs || (cachedFifthglyphs = loadFifthglyphs());
};
exports.fifthglyphs = fifthglyphs;

/**
 * Detects the presence of fifthglyphs in the specified text.
 *
 * @param text  The text in which to search for fifthglyphs.
 */
exports.detect = function (text) {
  if (typeof cachedRegex.allFifthglyphsWithMarkdown === 'undefined') {
    cachedRegex.allFifthglyphsWithMarkdown = new RegExp(
      `(\\*\\*|__)?([*_])?(?:${fifthglyphs().join('|')})+\\2\\1`, 'g');
  }
  if (typeof cachedRegex.multipleCodePoint === 'undefined') {
    cachedRegex.multipleCodePoint = new RegExp(
      fifthglyphs().filter(x => x.length > 1).join('|'), 'g');
  }
  var matches = text.match(cachedRegex.allFifthglyphsWithMarkdown) || [];
  var counts = matches.map(x => x.replace(/[*_]/g, '')
    .replace(cachedRegex.multipleCodePoint, 'e').length);
  return {
    count: counts.reduce(function (a, b) { return a + b; }, 0),
    longestRun: counts.reduce(function (a, b) { return Math.max(a, b); }, 0),
    bolded: matches.filter(x => x.startsWith('*') || x.startsWith('_')).length > 0
  };
};

/**
 * Replaces fifthglyphs that occur within the specified text.
 *
 * @param text  The text in which to mask fifthglyphs.
 */
exports.mask = function (text) {
  if (typeof cachedRegex.allFifthglyphs === 'undefined') {
    cachedRegex.allFifthglyphs = new RegExp(fifthglyphs().join('|'), 'g');
  }
  const mask = '■';
  return text.replace(cachedRegex.allFifthglyphs, mask);
};

/**
 * Gets offending words, and returns an array of them.
 *
 * @param text  The text to split.
 */
exports.splitMessage = function (text) {
  const regex = /[\w'’]*?■[\w'’]*/g;
  return text.match(regex);
};

/**
 * Removes URIs (RFC 3986) from the specified text.
 *
 * @param text  The text from which to remove links.
 */
exports.stripLinks = function (text) {
  const regex = /[a-z][\da-z+.-]*:\/\/(?:[\da-z._~%!$&'(*+,;=:@/?#-]|\)(?!\s))+/ig;
  return text.replace(regex, '[link]');
};
