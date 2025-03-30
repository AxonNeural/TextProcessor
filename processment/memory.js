const deconjugated_verbs_output = require('../../Deconjugator/Output/Radicals.json');
const stopwords = new Set(require('../storage/stopwords.json'));

const mapped_radicals = new Map();
for (const verb in deconjugated_verbs_output) {
    const radical = deconjugated_verbs_output[verb];
    mapped_radicals.set(verb, radical);
}

exports.get_radical = (verb) => {
    if(!mapped_radicals.has(verb)) return verb;
    return mapped_radicals.get(verb); 
};

exports.is_stopword = (word) => {
    return stopwords.has(word);
}