const firebase = require('@firebase/testing');

const MY_PROJECT_ID = process.env.PROJECT_ID;

const myId = "user_abc";
const myAuth = {uid: myId, email: "mathias.ovreseth@talmoe.com"};

const theirId = "user_xyz";

const invalidId = "intruder";
const calendarId = "calendar_Id"

function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

describe("calendar tests", () => {

    // an authenticated user with membership can create an event
    it("Can add a calendar event", async () => {
        const db = getFirestore(myAuth);
        const createTemp = db.collection('computerStations').doc(calendarId).collection('events').doc("event1");
        await firebase.assertSucceeds(createTemp.set({
            temp: "nice",
        }));
    });
    // an unathenticated user cant add events
    it("Can't add a calendar event", async () => {
        const db = getFirestore(null);
        const createTemp = db.collection('computerStations').doc(invalidId).collection('events').doc("event2");
        await firebase.assertFails(createTemp.set({
            temp: "nice",
        }));
    });
    // an unathenticated user cant remove events
    it("Can't remove a calendar event", async () => {
        const db = getFirestore(null);
        const createTemp = db.collection('computerStations').doc(theirId).collection('events').doc("event1");
        await firebase.assertFails(createTemp.delete());
    });
    // an authenticated user can remove events
    it("Can remove a calendar event", async () => {
        const db = getFirestore(myAuth);
        const createTemp = db.collection('computerStations').doc(myId).collection('events').doc("event1");
        await firebase.assertSucceeds(createTemp.delete());
    });



})
