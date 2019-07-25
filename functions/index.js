const functions = require('firebase-functions');
const enrollmentController = require('./src/controller/enrollment');

const admin = require('firebase-admin');

const app = admin.initializeApp(functions.config().firebase, 'testing');
const db = admin.firestore(app);

exports.sendNotification = functions.https.onRequest(enrollmentController.sendWeeklyNotification(db));
exports.handle = functions.https.onRequest(enrollmentController.handle(db));
exports.randomRoster = functions.https.onRequest(enrollmentController.randomRoster(db));