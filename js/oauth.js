var CLIENT_ID = '34859966666-9fsjbii6v3bm2q71p7pk6agfrmgfepsd.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/calendar.readonly'];

var appStart = function() {
    gapi.load('auth2', initSigninV2);
    gapi.client.load('calendar', 'v3');
    gapi.client.load('drive', 'v3');
    renderButton();
};

var initSigninV2 = function() {
    auth2 = gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' ')
    });

    // Listen for sign-in state changes.
    auth2.isSignedIn.listen(signinChanged);

    // Listen for changes to current user.
    auth2.currentUser.listen(userChanged);

    // Sign in the user if they are currently signed in.
    if (auth2.isSignedIn.get() == true) {
        auth2.signIn();
    }

    // Start with the current live values.
    refreshValues();
};

//used by angularjs to determine whether the menu is shown

/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
var signinChanged = function(val) {
    if (val) {
        loadSettings();
        window.location="#/secure/dashboard";
    } else {
        window.location="#/";
    }
    angular.element(document.getElementById('contentCtrl')).scope().$apply();
    console.log('Signin state changed to ', val);
};

/**
 * Listener method for when the user changes.
 *
 * @param {GoogleUser} user the updated user.
 */
var userChanged = function(user) {
    console.log('User now: ', user);
};

/**
 * Retrieves the current user and signed in states from the GoogleAuth
 * object.
 */
var refreshValues = function() {
    if (auth2) {
        console.log('Refreshing values...');

        googleUser = auth2.currentUser.get();
    }
}


function renderButton() {
    gapi.signin2.render('my-signin', {
        'scope': SCOPES.join(' '),
        'width': 250,
        'height': 50,
        'immediate': false,
        'longtitle': true,
        'theme': 'dark',
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}
