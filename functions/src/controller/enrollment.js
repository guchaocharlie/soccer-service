const request = require('request');
const messages = require('../util/messages');
const random = require('../util/random').random;

const slackChannel = 'https://hooks.slack.com/services/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';

const handle = (db, currentWeek) => (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const username = payload.user.name;
    const type = payload.actions[0].name;
    const value = payload.actions[0].value;
    if (type === 'enrollment') {
        enrollment(db, currentWeek, payload, username, value);
    }
};

const enrollment = (db, currentWeek, payload, username, value) => {
    const enrollmentRef = db.collection(currentWeek).doc(username);
    let message = {};
    let data = {
        [value]: true,
    };
    enrollmentRef.set(data, {merge: true});
    switch (value) {
        case 'play':
            message = messages.responseSuccessEnroll;
            break;
        case 'taxi':
            message = messages.responseSuccessOrderTaxi;
            break;
        case 'taxi-back':
            message = messages.responseSuccessOrderTaxiReturn;
            break;
    }
    request.post(
        payload.response_url,
        {
            json: message,
        },
        () => {}
    );
};

const closeEnrollment = (db, currentWeek) => (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const enrollmentRef = db.collection('enrollments').doc(currentWeek);
    enrollmentRef.set({
        status: 'closed',
    });

    request.post(
        payload.response_url,
        {
            json: messages.responseEnrollmentClosed,
        },
        () => {}
    );
};


const sendWeeklyNotification = (db, currentWeek) => (req, res) => {
    request.post(
        slackChannel,
        {
            json: messages.generalEnrollmentNotification,
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                res.send(body);
            } else {
                res.send(error);
            }
        }
    );
};

const randomRoster = (db, currentWeek) => (req, res) => {
    const enrollmentRef = db.collection(currentWeek);
    let query = enrollmentRef.where('play', '==', true).get()
        .then(snapshot => {
            const roster = [];
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                roster.push(doc.id);
            });

            const result = random(roster);
            console.log(result);
            request.post(
                slackChannel,
                {
                    json: messages.responseGetRoster(result),
                },
                function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        res.send(body);
                    } else {
                        res.send(error);
                    }
                }
            );
        })
};

module.exports = {
    handle,
    sendWeeklyNotification,
    closeEnrollment,
    randomRoster,
};