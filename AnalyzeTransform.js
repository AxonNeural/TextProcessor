const global = require('./global');

exports.transform = (Input) => {
    const segments_unfiltered = Input.split(/[.!]/);
    const segments_filtered = segments_unfiltered.map(part => part.trim()).filter(part => part.length > 0);

    let processed_input = [];
    for (let segment of segments_filtered) {
        const getCoreference = global.extractCoreference(segment);
        for (const pronoun of Object.keys(getCoreference)) {
            const correspondence = getCoreference[pronoun];
            segment = segment.replaceAll(pronoun, correspondence)
        };

        processed_input.push(segment);
    };

    const segments_unfiltered_step2 = processed_input.join(" ").split(/[.,?!]/);
    const segments_filtered_step2 = segments_unfiltered_step2.map(part => part.trim()).filter(part => part.length > 0);
    let callback = [];
    for (const segment of segments_filtered_step2) {
        callback.push({
            phrase: segment,
            tags: global.extractTags(segment, true)
        })
    };
};