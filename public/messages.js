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


function displayMessages() {

    console.log("sup");


    //console.log(data.users['4mS0tNjZF9eMey1Ya6dfFJ3aMfN2'].userID);



    /*for i = 0 i < something i ++ {

        if message.userrecieved == username

            display message
    }*/
}

function acceptExchange(id) {

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
    var requiredMessageInput = document.getElementById("message");

    message = "I ACCEPT YOUR OFFER"
    userSend = username;
    //offered, accepted
    var status = "accepted"

    // console.log(theirUsername)

    theirUsername = document.getElementById("testTheirs").innerText.slice(3)

        firebase.database().ref('exchanges/' + id).set({
            userRecieve: theirUsername,
            date: dateTime,
            message: message,
            userSend: username,
            status: status

        }).then(function () {
            // route to home page and set the url params respectivly
            alert('successfully added to database!');
            // window.location.href = '/messages?username=' + username + '&theirUsername=' + theirUsername
        }).catch(function (error) {
            // An error happened.
            alert(error);
        });

        var fill = "" + generateRandomNumber(1, 10000000);

        firebase.database().ref('messages/' + fill).set({
            userRecieve: theirUsername,
            date: dateTime,
            message: message,
            userSend: username,
            messageID: fill
        }).then(function () {
            // route to home page and set the url params respectivly
            alert('successfully added to database!');
         window.location.assign = '/messages?username=' + username + '&theirUsername=' + theirUsername
        }).catch(function (error) {
            // An error happened.
            alert(error);
        });
    }


function initExchange() {

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
    var requiredMessageInput = document.getElementById("message");

    userSend = username;
    //offered, accepted
    var status = "offered"

    // console.log(theirUsername)

    theirUsername = document.getElementById("testTheirs").innerText.slice(3)
        var fill = "" + generateRandomNumber(1, 10000000);
        message = "WOULD YOU LIKE TO ACCEPT MY SKATE SHOE EXCHANGE OFFER? <button onclick = 'acceptExchange("+fill+")' > YES</button><button> NO</button>"

        firebase.database().ref('exchanges/' + fill).set({
            userRecieve: theirUsername,
            date: dateTime,
            message: message,
            userSend: username,
            messageID: fill,
            status: status

        }).then(function () {
            // route to home page and set the url params respectivly
            alert('successfully added to database!');
            // window.location.href = '/messages?username=' + username + '&theirUsername=' + theirUsername
        }).catch(function (error) {
            // An error happened.
            alert(error);
        });

        firebase.database().ref('messages/' + fill).set({
            userRecieve: theirUsername,
            date: dateTime,
            message: message,
            userSend: username,
            messageID: fill
        }).then(function () {
            // route to home page and set the url params respectivly
            alert('successfully added to database!');
         window.location.assign('/messages?username=' + username + '&theirUsername=' + theirUsername)
        }).catch(function (error) {
            // An error happened.
            alert(error);
        });
    }

function messageUser() {

    var error = false;
    var error2 = false;
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
    var requiredMessageInput = document.getElementById("message");

    message = requiredMessageInput.value
    userSend = username;

    // console.log(theirUsername)

    theirUsername = document.getElementById("testTheirs").innerText.slice(3)
        var fill = "" + generateRandomNumber(1, 10000000);

        firebase.database().ref('messages/' + fill).set({
            userRecieve: theirUsername,
            date: dateTime,
            message: message,
            userSend: username,
            messageID: fill
        }).then(function () {
            // route to home page and set the url params respectivly
            alert('successfully added to database!');
            window.location.assign('/messages?username=' + username + '&theirUsername=' + theirUsername)
        }).catch(function (error) {
            // An error happened.
            alert(error);
        });
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