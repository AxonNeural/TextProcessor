const lexclass = require('../../LexClass/index');
const memory = require('./memory');
const randomTexts = require('../storage/randomTexts.json');

exports.cleanText = (text) => {
    return text
    .toLowerCase() 
    .replace(/[.,\/#!$@%\^&\*;:~\[\]{}?’‘=”\-_“'"`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

exports.getTFIDF = (context) => {
    const UnfilteredTokens = context.split(' ').filter(word => !memory.is_stopword(word.toLowerCase()));
    let UnfilteredArray = [...new Set(UnfilteredTokens)].filter(item => isNaN(item));

    function computeTFIDF(Word, Doc) {
        function computeTF(word, doc) {
            let count = 0;
            const words = doc.split(' ');
            words.forEach(w => {
                if (w === word) {
                    count++;
                }
            });
            return count / words.length;
        }

        function computeIDF(word, docs) {
            let count = 0;
            docs.forEach(doc => {
                if (doc.split(' ').includes(word)) {
                    count++;
                }
            });
            return Math.log(docs.length / (1 + count));
        }

        const tf = computeTF(Word, Doc);
        const idf = computeIDF(Word, randomTexts);
        return tf * idf;
    };

    let Tags = [];
    UnfilteredArray.forEach(word => {
        Tags.push({ tag: word, classification: lexclass.phraseClassification(word)[word], relevance: computeTFIDF(word, context) })
    });

    Tags.sort((a, b) => b.relevance - a.relevance);
    return Tags;
};