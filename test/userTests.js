const firebase = require('@firebase/testing');
const MY_PROJECT_ID = process.env.PROJECT_ID;

const myId = "user_abc";
const myAuth = {uid: myId, email: "mathias.ovreseth@talmoe.com"};

const theirId = "user_xyz";
const theirAuth = {uid: theirId, email: "geir@test.no"};


function getFirestore(auth) {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

describe("user tests", () => {

    // Create/read/update user--------------------------------------------------------------------

    // new users that has authenticated can create a user doc in the database
    it("Can create a user", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertSucceeds(testDoc.set({
            uid: myId,
            name: "Mathias",
            foo: "bar",
        }));
    });


    // New users that hasn't authenticated can't create a user doc in the database
    it("Can't create a user", async () => {
        const db = getFirestore(null);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.set({
            uid: myId,
            name: "Mathias",
            foo: "bar",
        }));
    });
    // The user that "owns" the user doc can update itself
    it("Can update a user", async () => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertSucceeds(testDoc.update({
            foo: "geir",
        }));
    });
    // a user can't update another user
    it("Can't update a user", async () => {
        const db = getFirestore(theirAuth);
        const testDoc = db.collection('users').doc(myId);
        await firebase.assertFails(testDoc.set({
            foo: "geir",
        }));
    });
    // an unathenticated user cant read other users
    it("can't read a user", async () => {
        const db = getFirestore(null);
        const testQuery = db.collection('users').doc(myId);
        await firebase.assertFails(testQuery.get());
    });

    // an authenticated user can read other users
    it("can read a user", async () => {
        const db = getFirestore(myAuth);
        const testQuery = db.collection('users').doc(myId);
        await firebase.assertSucceeds(testQuery.get());
    });


})
