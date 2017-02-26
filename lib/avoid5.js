/**
 * avoid5.js -- Support library for avoiding fifthglyphs.
 */

/**
 * Detects the presence of fifthglyphs in the specified text.
 *
 * @param text  The text in which to search for fifthglyphs.
 */
exports.detect = function (text) {
  const regex = /(\*\*|__)?([*_])?[eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэEĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€]+\2\1/g;
  var matches = text.match(regex) || [];
  var counts = matches.map(x => x.replace(/[*_]/g, '').length);
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
  const lowercase = /[eĕêěɇėẹëèéēẽęæœɛɜəǝɘεеєэ]/g;
  const uppercase = /[EĔÊĚɆĖẸËÈÉĒẼĘÆŒƐƏƎΕЕЄЭ€]/g;
  const lowermask = '■';
  const uppermask = '█';
  return text.replace(lowercase, lowermask).replace(uppercase, uppermask);
};

/**
 * Gets only the words surrounding the offending word, and returns an array of them.
 *
 * @param text  The text to split.
 */
exports.splitMessage = function (text) {
  const regex = /((?:\S+\s*){0,1}\S*[█■]\S*(?:\s*\S+){0,1})/g;
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
