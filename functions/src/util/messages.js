const moment = require('moment');

const currentWeek = moment().week();
const thisFriday = moment().day("Friday");

const generalEnrollmentNotification = {
    "text": `Heyyyy everyone, week ${currentWeek}'s (${thisFriday}) soccer enrolment has started!`,
    "attachments": [
        {
            "text": "Please confirm if you want to play or not",
            "fallback": "You are unable to choose a game",
            "callback_id": "soccer",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "enrollment",
                    "text": "I want to play!",
                    "type": "button",
                    "style": "primary",
                    "value": "play"
                },
                {
                    "name": "enrollment",
                    "text": "I need taxi!",
                    "type": "button",
                    "style": "danger",
                    "value": "taxi",
                },
                {
                    "name": "enrollment",
                    "text": "I need taxi back!",
                    "style": "danger",
                    "type": "button",
                    "value": "taxi-back",
                }
            ]
        },
        {
            "type": "divider"
        }
    ]
};

const responseSuccessEnroll = {
    "text": `Congratulation! You have successfully enrolled in week ${currentWeek}'s (${thisFriday}) soccer game!`,
    "response_type": "ephemeral",
    "replace_original": false
};

const responseSuccessOrderTaxi = {
    "text": `Taxi :taxi: is confirmed for week ${currentWeek}!`,
    "response_type": "ephemeral",
    "replace_original": false
};

const responseSuccessOrderTaxiReturn = {
    "text": `Taxi return :taxi: is confirmed for week ${currentWeek}!`,
    "response_type": "ephemeral",
    "replace_original": false
};

const responseEnrollmentClosed = {
    "text": `Are you sure to close the enrollment for week ${currentWeek}'s (${thisFriday}) soccer game?`,
    "attachments": [
        {
            "text": "Please confirm if you want to play or not",
            "fallback": "You are unable to choose a game",
            "callback_id": "soccer",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "cancel_enrollment_confirm",
                    "text": "Yes!",
                    "type": "button",
                    "style": "primary",
                    "value": "cancel_confirm"
                },
                {
                    "name": "cancel_enrollment_reject",
                    "text": "No",
                    "type": "button",
                    "style": "danger",
                    "value": "cancel_reject",
                },
            ]
        },
    ],
    "response_type": "ephemeral",
    "replace_original": false
};

const responseGetRoster = (result) => {
    const fields = [
        {
            "type": "mrkdwn",
            "text": "*Team light*"
        },
        {
            "type": "mrkdwn",
            "text": "*Team dark*"
        },
    ];
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
            "text": result.array1[length - 1],
        });
    }
    return {
        "text": `Here is this week's roster:`,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Here is this week's roster:"
                },
                "fields": fields
            }
        ]
    };
};

module.exports = {
    generalEnrollmentNotification,
    responseSuccessEnroll,
    responseSuccessOrderTaxi,
    responseSuccessOrderTaxiReturn,
    responseEnrollmentClosed,
    responseGetRoster,
};