const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

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

exports.itemsCreateLog = functions.firestore.document('logs/{logId}').onCreate(event => {
    const logId = event.params.logId;

    console.log('on create called for log id ', logId);

    var document = event.data.data();

    // category,itemId,logType,quantity
    console.log('doc ', document);

    var category = document.category;
    var itemId = document.itemId;
    var logType = document.logType;
    var quantity = document.quantity;
    var timestamp = document.date;

    if (category !== "Inventory") {
        return "NOT INVENTORY LOG";
    }

    if (logType === "Issued") {
        quantity = quantity * -1;
    }

    itemDocRef = firestore.doc('items/' + itemId);
    var transaction = firestore.runTransaction(mTransaction => {
        return mTransaction.get(itemDocRef)
            .then(itemDoc => {
                var modifiedQuantity = itemDoc.data().itemQuantity + quantity;
                mTransaction.update(itemDocRef, {
                    itemQuantity: modifiedQuantity,
                    lastModified: timestamp
                });
            })
    }).then(result => {
        console.log('Transaction for added log success');
    }).catch(err => {
        console.error('Transaction error for add log ', err);
    })

    return "OK";

});

exports.itemsDeleteLog = functions.firestore.document('logs/{logId}').onDelete(event => {

    const logId = event.params.logId;
    console.log('on delete called for log id ', logId);

    var previousDocument = event.data.previous.data();

    if (previousDocument) {

        console.log('previuos doc ', previousDocument);

        var category = previousDocument.category;
        var itemId = previousDocument.itemId;
        var logType = previousDocument.logType;
        var quantity = previousDocument.quantity;
        var timestamp = previousDocument.date;

        if (category !== "Inventory") {
            return "NOT INVENTORY LOG";
        }

        if (logType === "Issued") {
            quantity = quantity * -1;
        }

        itemDocRef = firestore.doc('items/' + itemId);
        var transaction = firestore.runTransaction(mTransaction => {
            return mTransaction.get(itemDocRef)
                .then(itemDoc => {
                    var modifiedQuantity = itemDoc.data().itemQuantity - quantity;
                    mTransaction.update(itemDocRef, {
                        itemQuantity: modifiedQuantity,
                        lastModified: timestamp
                    });
                })
        }).then(result => {
            console.log('Transaction for delete log success');
        }).catch(err => {
            console.error('Transaction error for delete log ', err);
        })

        return "OK";
    }

    return "FAILED AT FETCHING PREVIOUS DOC";
});

exports.itemsUpdateLog = functions.firestore.document('logs/{logId}').onUpdate(event => {

    const logId = event.params.logId;
    console.log('on update called for log id ', logId);

    var previousQuantity = 0;
    var previousDocument = event.data.previous.data();

    if (previousDocument) {
        console.log('previuos doc ', previousDocument);

        if (previousDocument.category !== "Inventory") {
            return "NOT INVENTORY LOG";
        }

        if (previousDocument.logType === "Issued") {
            previousQuantity = previousDocument.quantity * -1;
        } else {
            previousQuantity = previousDocument.quantity;
        }
    }

    var document = event.data.data();

    var category = document.category;
    var itemId = document.itemId;
    var logType = document.logType;
    var quantity = document.quantity;
    var timestamp = document.date;

    if (logType === "Issued") {
        quantity = quantity * -1;
    }

    itemDocRef = firestore.doc('items/' + itemId);
    var transaction = firestore.runTransaction(mTransaction => {
        return mTransaction.get(itemDocRef)
            .then(itemDoc => {
                var modifiedQuantity = itemDoc.data().itemQuantity - previousQuantity + quantity;
                mTransaction.update(itemDocRef, {
                    itemQuantity: modifiedQuantity,
                    lastModified: timestamp
                });
            })
    }).then(result => {
        console.log('Transaction for update log success');
    }).catch(err => {
        console.error('Transaction error for update log ', err);
    })

    return "OK";

});