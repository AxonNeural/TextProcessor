const lexclass = require('../LexClass/index');
const public = require('./processment/public');
const memory = require('./processment/memory')

exports.extractTags = (Text, onlyRadical = false) => {
    const cleanText = public.cleanText(Text);
    let getTFIDF = public.getTFIDF(cleanText);

    if (onlyRadical) for (let obj of getTFIDF) obj.tag = memory.get_radical(obj.tag);
    return getTFIDF;
}

exports.extractCoreference = (Text) => {
    let callback = {};

    for (const part of Text.split('.')) {
        const cleanText = public.cleanText(part);
        const getTFIDF = public.getTFIDF(cleanText);
    
        const get_onlyNouns = getTFIDF.filter(item => item.classification.includes("N"));
        const mainNoun = get_onlyNouns.length > 0 ? get_onlyNouns.reduce((maxObj, item) => (item.relevance > maxObj.relevance ? item : maxObj), get_onlyNouns[0]) : null;
    
        const getPhraseClassification = lexclass.phraseClassification(cleanText);
        const getPronouns = Object.keys(getPhraseClassification).filter(chave => getPhraseClassification[chave].includes('PRO'));

        const validPronouns = getPronouns.filter(item => ["eu", "tu", "ele", "ela", "nós", "vós", "eles", "elas", "deles", "delas", "dele", "dela"].includes(item));
        for (const pronoun of validPronouns) {
            callback[pronoun] = mainNoun.tag;
        }
    }

    return callback;
}