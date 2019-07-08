const functions = require('firebase-functions');
const enrollmentController = require('./src/controller/enrollment');
const moment = require('moment');

const admin = require('firebase-admin');

const currentWeek = `${moment().year()}_${moment().week()}`;

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.sendNotification = functions.https.onRequest(enrollmentController.sendWeeklyNotification(db, currentWeek));
exports.handle = functions.https.onRequest(enrollmentController.handle(db, currentWeek));
exports.closeEnrolment = functions.https.onRequest(enrollmentController.closeEnrollment(db, currentWeek));
exports.randomRoster = functions.https.onRequest(enrollmentController.randomRoster(db, currentWeek));