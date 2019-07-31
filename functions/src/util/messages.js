const moment = require('moment');
const dbUtil = require('../util/checkDb');
const currentWeek = () => moment().week();
const thisFriday = () => moment().day("Friday").format('MMMM Do YYYY');

const generalEnrollmentNotification = async (db, needOverWrite = "false") => {
    let enrollFigure = await dbUtil.getNumberOfEnrollment(db);
    return {
        "replace_original": `${needOverWrite}`,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Heyyyy everyone, week ${currentWeek()}'s (${thisFriday()}) soccer enrollment has started!`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "Please confirm if you want to play:",
                    "emoji": true
                }
            },
            {
                "type": "actions",
                "block_id": "enrollment",
                "elements": [
                    {
                        "type": "button",
                        "action_id": "play",
                        "style": "primary",
                        "text": {
                            "type": "plain_text",
                            "text": "I want to play!"
                        }
                    },
                    {
                        "type": "button",
                        "action_id": "taxi",
                        "style": "danger",
                        "text": {
                            "type": "plain_text",
                            "text": "I need taxi!"
                        }
                    }
                ]
            },
            {
                "type": "divider"
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": `*Current Enrollment:* ${enrollFigure.numberOfEnrollment}, ${enrollFigure.numberOfPeopleNeedTaxi} people need taxi`
                    }
                ]
            }
        ]
    };
};

const responseSuccessEnroll = {
    "text": `Congratulation! You have successfully enrolled in week ${currentWeek()}'s (${thisFriday()}) soccer game!`,
    "response_type": "ephemeral",
    "replace_original": false
};

const responseSuccessOrderTaxi = {
    "text": `Taxi :taxi: is confirmed for week ${currentWeek()}!`,
    "response_type": "ephemeral",
    "replace_original": false
};

const responseGetRoster = (result) => {
    let finalBlock = {};
    const fields = [];
    const fields1 = [];
    const fields2 = [];
    if (result.array1.length > 5) {
        for (let i = 0; i < 5; i++) {
            fields1.push({
                "type": "plain_text",
                "text": result.array1[i],
            });
            fields1.push({
                "type": "plain_text",
                "text": result.array2[i],
            });
        }
        if (result.array2.length > 5) {
            for (let i = 5; i < result.array2.length; i++) {
                fields2.push({
                    "type": "plain_text",
                    "text": result.array1[i],
                });
                fields2.push({
                    "type": "plain_text",
                    "text": result.array2[i],
                });
            }
        }

        if (result.array1.length > result.array2.length) {
            fields2.push({
                "type": "plain_text",
                "text": result.array1[result.array1.length - 1],
            });
            fields2.push({
                "type": "plain_text",
                "text": " ",
            });
        }

        finalBlock = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Here is this week's roster:"
                },
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Team light*"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Team dark*"
                    },
                ]
            },
            {
                "type": "section",
                "fields": fields1,
            },
            {
                "type": "section",
                "fields": fields2,
            },
        ];
    } else {
        for (let i = 0; i < result.array2.length; i++) {
            fields.push({
                "type": "plain_text",
                "text": result.array1[i],
            });
            fields.push({
                "type": "plain_text",
                "text": result.array2[i],
            });
        }
        if (result.array1.length > result.array2.length) {
            fields.push({
                "type": "plain_text",
                "text": result.array1[result.array1.length - 1],
            });
            fields.push({
                "type": "plain_text",
                "text": " ",
            });
        }
        finalBlock = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Here is this week's roster:"
                },
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Team light*"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Team dark*"
                    },
                ]
            },
            {
                "type": "section",
                "fields": fields,
            },
        ];
    }
    return {
        "text": `Here is this week's roster:`,
        "blocks": finalBlock
    };
};

module.exports = {
    generalEnrollmentNotification,
    responseSuccessEnroll,
    responseSuccessOrderTaxi,
    responseGetRoster,
};