/**
 * avoid5-reddit.js -- Reddit-specific handlers.
 */

const avoid5 = require('./avoid5.js');
/**
 * Handles the specified Reddit post.
 *
 * @param message   The message from the Reddit post.
 */
 const handlePost = function(post, type) {
   if(post.author.name == config.reddit.credentials.username){
     return;
   }
   if(type == 'submission') {
       var postText = post.title + '\n\n' + post.selftext
   } else if(type == 'comment'){
       var postText = post.body
   }
   var results = avoid5.detect(stripMentions(avoid5.stripLinks(postText)));
   //TODO: add banning for lots of e's.
   if (results.count > 0) {
     post.reply('A fifthglyph was found in your post: \n>' + quote(avoid5.mask(postText)));
   }
 }

 /**
  * Removes Reddit-style mentions from the specified text.
  *
  * @param text  The text from which to remove mentions.
  */
 const stripMentions = function(text) {
   const regex = /\/u\/[A-z-_0-9]+/gi;
   return text.replace(regex, ' ');
 }

 /**
  * Does a Markdown quote on all the lines.
  *
  * @param text  The text to qote.
  */
 const quote = function(text) {
   const regex = /\r?\n|\r/g;
   return text.replace(regex, '\n>');
 }

 exports.stripMentions = stripMentions;
 exports.handlePost = handlePost;
