const request = require('request');
const messages = require('../util/messages');
const random = require('../util/random').random;
const functions = require('firebase-functions');
const moment = require('moment');

const slackChannel = functions.config().slack.url;
const currentWeek = `${moment().year()}_${moment().week()}`;

const handle = (db) => (req, res) => {
    const payload = JSON.parse(req.body.payload);
    const username = payload.user.name;
    const type = payload.actions[0].block_id;
    const value = payload.actions[0].action_id;
    if (type === 'enrollment') {
        enrollment(db, payload, username, value);
    }
};

const enrollment = (db, payload, username, value) => {
    const enrollmentRef = db.collection(currentWeek).doc(username);
    let message = {};
    let data = {
        [value]: true,
    };
    enrollmentRef.set(data, {merge: true}).then(() => {
        switch (value) {
            case 'play':
                message = messages.responseSuccessEnroll;
                break;
            case 'taxi':
                message = messages.responseSuccessOrderTaxi;
                break;
        }
        messages.generalEnrollmentNotification(db, "true").then((messageObject) => {
            request.post(
                payload.response_url,
                {
                    json: messageObject,
                },
                () => {}
            );
        });

        request.post(
            payload.response_url,
            {
                json: message,
            },
            () => {}
        );
    });
};

const sendWeeklyNotification = (db) => (req, res) => {
    messages.generalEnrollmentNotification(db).then((message) => {
        request.post(
            slackChannel,
            {
                json: message,
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    res.send(body);
                } else {
                    console.log(error);
                    res.send(error);
                }
            }
        );
    });
};

const randomRoster = (db) => (req, res) => {
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
    randomRoster,
};