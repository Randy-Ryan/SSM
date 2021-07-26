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
            dbRef.child("users").child(userID).get().then((snapshot) => {
                if (snapshot.exists()) {
                    email = snapshot.val().email;
                    username = snapshot.val().username;
                    document.getElementById('storeRef').href = '/store?username=' + username;
                    loadAccountPage();
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            dbRef.child("messages").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        if (doc.val().userSend == username){
                            document.getElementById("messageFeed").innerHTML += "<span class='msg-container'><span class='ToFrom'>To: <a style='display: inline-block;' href='messages?username=" + doc.val().userSend +"&theirUsername=" + doc.val().userRecieve + "'>" + doc.val().userRecieve +"</a></span><span style='text-align: right' class='main-message'>"+doc.val().message + "</span></span>"
                        }
                        if (doc.val().userRecieve == username){
                            document.getElementById("messageFeed").innerHTML += "<span class='msg-container'><span class='ToFrom'>From: <a style='display: inline-block;' href='messages?username=" + doc.val().userRecieve +"&theirUsername=" + doc.val().userSend + "'>" +doc.val().userSend +"</a></span><span style='text-align: left' class='main-message'>"+ doc.val().message + "</span></span>"
                        }
                    } else {
                        console.log("No data available");
                    }
                })
            }).catch((error) => {
                console.error(error);
            });

            var overallRating = 0;
            var count = 0
            dbRef.child("ratings").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        if (doc.val().userRecieve == username){
                            document.getElementById("ratingsFeed").innerHTML += "<span class='feedChild'>From: " + doc.val().userSend +" | Rating: "+ doc.val().rating + "/5 | Comment: " + doc.val().comment + "</span>"
                            parse = parseInt(doc.val().rating);
                            console.log(parse);
                            count++;
                            overallRating = parse + overallRating;
                            document.getElementById("overallRating").innerHTML = "Overall rating: " + overallRating/count;
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
                        if (doc.val().username == username){
                            document.getElementById("postFeed").innerHTML += "<span class='feedChild'>" + doc.val().brand +" | Size "+doc.val().size + "</span>"
                        }
                    } else {
                        console.log("No data available");
                    }
                })
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
            //document.getElementById("accountRef").style.display = "";
            document.getElementById("accountPage").style.display = "";

            //load account page for now - should load home page

        } else {
            // User is signed out
            //document.getElementById("postRef").style.display = "none";
            //document.getElementById("accountRef").style.display = "none";
            userIsSignedOut();
        }
    });
}

// function to load account page
function loadAccountPage() {

    // show account page & hide the rest

    // set the html account elements respectivly 
    document.getElementById("usernameDisplay").innerText = "Username: " + username;
    document.getElementById("emailDisplay").innerText = "Email: " + email;
    document.getElementById("idDisplay").innerText = "ID: " + userID;

}

// on sign out button click
function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        userIsSignedOut();
    }).catch((error) => {
        alert("Error signing out:" + error);
    });
}

// function to style page when user is signed out
function userIsSignedOut() {

    //show login page % hide the rest

    window.location.href = "./index.html"
    //shouldnt be the case so route to home
}
