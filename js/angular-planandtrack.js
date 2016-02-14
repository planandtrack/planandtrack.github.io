var app = angular.module('single-page-app', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'ButtonCtrl'
        }).when("/secure/plan/general", {
            templateUrl: 'secure/plan/general.html',
            controller: 'CalendarCtrl'
        }).when('/:name*', {
            templateUrl: function(urlattr){
                return '/' + urlattr.name + '.html';
            },
        });
        
});

app.controller('ButtonCtrl', function($scope) {
    // this hack prevents a render the first time the page is loaded.
    // The render is instead triggered by oauth.js after the site has loaded.
    if (gapi.auth2)
        renderButton()
});

app.controller('CalendarCtrl', function($scope,$document) {
    var date = "2016-01-10";
    var renderCalendar = function() {
        $('#calendar').fullCalendar(getCalendar(date,$scope.calendarSettings.calendars))
    };
    $document.ready(deferUntilCalendar(renderCalendar));
});

app.controller('contentCtrl', function($scope, $location, $window) {
    $scope.menuClass = function(page) {
        var current = $location.path().substring(1);
        var ret = (page === current ? "active" : "");
        return ret;
    };
    $scope.menuClassPrefix = function(page) {
        var current = $location.path().substring(1);
        var prefix = current.substring(0,page.length);
        var ret = (page === prefix ? "active" : "");
        return ret;
    };
    $scope.isLoggedIn = function() {
        if (typeof gapi !== 'undefined') {
            if (gapi.auth2) {
                return gapi.auth2.getAuthInstance().isSignedIn.get();
            }
        }
        return false;
    }
    $scope.calendarSettings = {'calendars':{}};
    
}).directive('toggleParent', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.parent().toggleClass(attrs.toggleParent);
            });
        }
    };
});

