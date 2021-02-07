var nlp = require("compromise");
var posTagger = require("wink-pos-tagger");
var tagger = posTagger();

exports.getTags = async function(stringToBeProcessed) {
  let tags = [];
  // Processing Title & Converting to Tags
  let sentenceNLPnoun = await nlp(stringToBeProcessed).match("#Noun");
  let sentenceNLPverb = await nlp(stringToBeProcessed).match("#Verb");
  let sentenceNLPcombine =
    await sentenceNLPnoun.sentences().toPresentTense().out() + " "
    + nlp(sentenceNLPnoun).sentences().toPresentTense().out() + " "
    + nlp(sentenceNLPverb).sentences().toPresentTense().out() + " "
    + nlp(sentenceNLPverb).sentences().toPastTense().out();
  sentenceNLPcombine = sentenceNLPcombine.toLowerCase();
  // sentenceNLPcombine = nlp(sentenceNLPcombine)
  //   .out();
  sentenceNLPcombine = await tagger.tagSentence(sentenceNLPcombine);
  await sentenceNLPcombine.forEach(element => {
    if (element.lemma && element.lemma.length >= 3) tags.push(element.lemma);
  });
  return tags;
};

exports.getTagsOfMeaning = async function(stringToBeProcessed) {
  let tags = [];
  // Processing Title & Converting to Tags
  let sentenceNLPnoun = await nlp(stringToBeProcessed).match("#Noun");
  let sentenceNLPverb = await nlp(stringToBeProcessed).match("#Verb");
  let sentenceNLPadverb = await nlp(stringToBeProcessed).match("#Adverb");
  let sentenceNLPadjective = await nlp(stringToBeProcessed).match("#Adjective");
  // console.log("VERBS: ", sentenceNLPverb.out());
  let sentenceNLPcombine =
    await sentenceNLPnoun.out() + " " + sentenceNLPverb.out() + " " + sentenceNLPadverb.out() + " " + sentenceNLPadjective.out();
  sentenceNLPcombine = sentenceNLPcombine.toLowerCase();
  // console.log("sentenceNLPcombine: ", sentenceNLPcombine);
  sentenceNLPcombine = nlp(sentenceNLPcombine)
    .sentences()
    .toPastTense()
    .out();
  sentenceNLPcombine = await tagger.tagSentence(sentenceNLPcombine);
  await sentenceNLPcombine.forEach(element => {
    // console.log(element);
    if (element.lemma && element.lemma.length >= 3) tags.push(element.lemma);
  });
  return tags;
};
