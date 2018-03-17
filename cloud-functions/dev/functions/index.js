const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {

    const payload = {
        notification: {
            title: 'New message!',
            body: `Darshan sent you a new message`,
            icon: 'https://goo.gl/Fz9nrQ'
            // "click_action" : "https://dummypage.com"
        }
    }

    const db = admin.firestore();
    const userRef = db.collection('users');

    userRef.get()
        .then(querySnapshot => {
            let tokens = [];
            querySnapshot.forEach(userDoc => {
                if (userDoc.data().fcmTokens) {
                    tokens = tokens.concat(Object.keys(userDoc.data().fcmTokens));
                }
            });
            if (!tokens.length) {
                throw new Error('User does not have any tokens!');
            }
            console.log('tokens ', tokens)
            return admin.messaging().sendToDevice(tokens, payload)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        })
        .catch(err => console.log(err))

    response.send("Hello from Firebase!");
});