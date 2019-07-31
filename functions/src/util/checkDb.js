const moment = require('moment');
const currentWeekMongoSting = () => `${moment().year()}_${moment().week()}`;

const getNumberOfEnrollment = async (db) => {
    const snap = await db.collection(currentWeekMongoSting()).where('play', '==', true).get();
    let numberOfEnrollment = 0;
    if (!snap.empty) {
        snap.forEach(() => {
            numberOfEnrollment++;
        });
    }

    const snapTaxi = await db.collection(currentWeekMongoSting()).where('taxi', '==', true).get();
    let numberOfPeopleNeedTaxi = 0;
    if (!snapTaxi.empty) {
        snapTaxi.forEach(() => {
            numberOfPeopleNeedTaxi++;
        });
    }
    return {
        numberOfEnrollment,
        numberOfPeopleNeedTaxi,
    };
};

module.exports = {
    getNumberOfEnrollment,
};