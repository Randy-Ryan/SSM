const firebaseConfig = {
    apiKey: "AIzaSyDBLsz1BVWiJTB5HofoERqvW03G0ihMY5s",
    authDomain: "skateshoemate-3a12f.firebaseapp.com",
    databaseURL: "https://skateshoemate-3a12f-default-rtdb.firebaseio.com",
    projectId: "skateshoemate-3a12f",
    storageBucket: "skateshoemate-3a12f.appspot.com",
    messagingSenderId: "62694744898",
    appId: "1:62694744898:web:3dd732327ebd241a5a5edb",
    measurementId: "G-3CYN3Z5E83"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage().ref();
var database = firebase.database();
var userID = "";
var username = "";
var email = "";
const dbRef = firebase.database().ref();

window.onload = function () {

    var overallRating = 0;
    var count = 0
    dbRef.child("ratings").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                if (doc.val().userRecieve == theirUsername) {
                    document.getElementById("ratingsFeed").innerHTML += "<span class='feedChild'>From: " + doc.val().userSend + " | Rating: " + doc.val().rating + "/5 | Comment: " + doc.val().comment + "</span>"
                    parse = parseInt(doc.val().rating);
                    console.log(parse);
                    count++;
                    overallRating = parse + overallRating;
                    document.getElementById("overallRating").innerHTML = "Overall rating: " + overallRating / count;
                }
            } else {
                console.log("No data available");
            }
        })
    }).catch((error) => {
        console.error(error);
    });


    dbRef.child("shoes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                if (doc.val().username == theirUsername) {
                    document.getElementById("postFeed").innerHTML += "<span class='feedChild'>" + doc.val().brand + " | Size " + doc.val().size + "</span>"
                }
            } else {
                console.log("No data available");
            }
        })
    }).catch((error) => {
        console.error(error);
    });
}
