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



// on page load check if user is signed in - style respectivly
window.onload = function () {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userID = user.uid;
            document.getElementById("accountRef").style.display = "";

            dbRef.child("users").child(userID).get().then((snapshot) => {
                if (snapshot.exists()) {
                    email = snapshot.val().email;
                    username = snapshot.val().username;
                    document.getElementById('storeRef').href = '/store?username=' + username;

                    // document.getElementById("username").innerText = username;

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
            // set global vars to use for this user

            // username = user.displayName;
            // user.phoneNumber
            // user.photoURL
            // user.emailVerified
            // user.email
            // ...

            // hide login/register pages
            // will add more hides here
            // document.getElementById("postRef").style.display = "";
            document.getElementById("accountRef").style.display = "";


            //load account page for now - should load home page

        } else {
            // User is signed out
            document.getElementById("postRef").style.display = "none";
            document.getElementById("accountRef").style.display = "none";
            userIsSignedOut();
        }
    });
}

function testc(){

    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var dateTime = date+' '+strTime;
    
    userSend = username;

    var test1 = document.getElementById("ratingInput");
    var test2 = document.getElementById("userRating");
    var test3 = document.getElementById("userRecieve");

    comment = test2.value
    rating = test1.value

    var fill = "" + generateRandomNumber(1, 10000000);

    firebase.database().ref('ratings/' + fill).set({
        userRecieve: theirUsername,
        date: dateTime,
        rating: rating,
        comment: comment,
        userSend: username,
        ratingID: fill
    }).then(function () {
        // route to home page and set the url params respectivly
        alert('successfully added to database!');
        window.location.href = '/store'
    }).catch(function (error) {
        // An error happened.
        alert(error);
    });

}

function makeClean(inputDiv) {
    //text set to black
    inputDiv.parentNode.style.color = "#000000";
    //text field set to white	
    inputDiv.style.backgroundColor = "#FFFFFF";
}

const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}