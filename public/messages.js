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
                    document.getElementById("username").innerText = username;

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
            document.getElementById("postRef").style.display = "";
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


function displayMessages() {

    console.log("sup");


    //console.log(data.users['4mS0tNjZF9eMey1Ya6dfFJ3aMfN2'].userID);



    /*for i = 0 i < something i ++ {

        if message.userrecieved == username

            display message
    }*/
}
function messageUser() {

    var error = false;
    var error2 = false;

    var requiredMessageInput = document.querySelectorAll(".requiredMessageInput");

    for (var i = 0; i < requiredMessageInput.length; i++) {
        error = false;
        // console.log(requiredMessageInput.length);
        // if blank input, prevent form submission
        // make input fields red and set error to true
        if (isBlank(requiredMessageInput[i])) {
            // e.preventDefault();
            makeRed(requiredMessageInput[i]);
            error = true;
            error2 = true;
            console.log("error 1");
        }
        // make input field normal if no error
        // usage when first case is error, but second is not
        if (error == false) {
            makeClean(requiredMessageInput[i]);
        }
    }

    if (error2 == false) {
        // no input errors, should then log into account through firebase
        for (var i = 0; i < requiredMessageInput.length; i++) {
            console.log(requiredMessageInput[i].value);
            // stance, brand, quality, size, imageURL
            if (i == 0) {
                userRecieve = requiredMessageInput[i].value;
                console.log(userRecieve);
            }
            if (i == 1) {
                date = requiredMessageInput[i].value;
                console.log(date);
            }
            if (i == 2) {
                message = requiredMessageInput[i].value;
                console.log(message);
            }
        }
        userSend = username;

        var fill = "" + generateRandomNumber(1, 10000000);

        firebase.database().ref('messages/' + fill).set({
            userRecieve: userRecieve,
            date: date,
            message: message,
            userSend: userSend,
            messageID: fill
        }).then(function () {
            // route to home page and set the url params respectivly
            alert('successfully added to database!');
            window.location.href = "/messages"
        }).catch(function (error) {
            // An error happened.
            alert(error);
        });

        if (error2 == false) {
            // no input errors, should then log into account through firebase
            for (var i = 0; i < requiredMessageInput.length; i++) {
                console.log(requiredMessageInput[i].value);
                // stance, brand, quality, size, imageURL
                if (i == 0) {
                    userSend = requiredMessageInput[i].value;
                }
                if (i == 1) {
                    userRecieve = requiredMessageInput[i].value;
                }
                if (i == 2) {
                    date = requiredMessageInput[i].value;
                }
                if (i == 3) {
                    message = requiredMessageInput[i].value;
                }
                if (i == 4) {
                    // messageID = "" + generateRandomNumber(1, 10000000);
                }

                var fill = "" + generateRandomNumber(1, 10000000);

                firebase.database().ref('messages/' + fill).set({
                    userSend: userSend,
                    userRecieve: userRecieve,
                    date: date,
                    message: message,
                    messageID: fill
                }).then(function () {
                    // route to home page and set the url params respectivly
                    alert('successfully added to database!');
                    window.location.href = "/messages"
                }).catch(function (error) {
                    // An error happened.
                    alert(error);
                });

            }

        }
    }
}

//function to check if input field is blank
function isBlank(inputField) {
    //checks for empty checkbox
    if (inputField.type === "checkbox") {
        if (inputField.checked) {
            return false;
        }
        else {
            return true;
        }
    }
    //checks for empty input fields
    if (inputField.value === "") {
        return true;
    }
    else {
        return false;
    }
}
//function to make the input fields red
function makeRed(inputDiv) {
    //input field set to red
    inputDiv.style.backgroundColor = "#c80815";
}
//function to reset the input fields to normal
function makeClean(inputDiv) {
    //text set to black
    inputDiv.parentNode.style.color = "#000000";
    //text field set to white	
    inputDiv.style.backgroundColor = "#FFFFFF";
}

const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}