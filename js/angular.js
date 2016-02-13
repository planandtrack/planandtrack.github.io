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
    var defaultDate = "2016-01-10";

    var renderCalendar = function() {
        var eventSources = [];
        iterateObject($scope.calendarSettings.calendars, function(id,cal){

            if (cal.showCal) {
                eventSources.push({
                    events: loadGcalOauth(id),
                    color: cal.color
                });
            }
        })
        $('#calendar').fullCalendar({
            // put your options and callbacks here
            height: 650,
            header: {
                left: 'today prev,next',
                center: 'title',
                right: 'agendaDay,agendaWeek'
            },
            defaultView: 'agendaWeek',
            //axisFormat: 'H:mm',
           // timeFormat: 'H(:mm)',
            //firstDay: 1,
            lang: 'de',
            fixedWeekCount: false,
            eventLimit: true, // for all non-agenda views
            views: {
                agenda: {
                    eventLimit: false
                },
                agendaWeek: {
                    titleFormat: 'DD.MMMYYYY'
                }
            },
            eventSources: eventSources,
            defaultDate: defaultDate,
            editable: true,
            eventRender: function(event, element, view) { 
                // Grab event data
                var title = event.title;
                element.qtip({
                    content: {
                        title: generateBubbleTitle(event),
                        text: generateBubbleText(event,$scope.calendarSettings.calendars)
                    },
                    position: {
                        target: 'mouse',
                        my: "bottom center",
                        adjust: {
                            mouse: false,
                            screen: true // Keep the tooltip within the viewport at all times
                        }
                    },
                    show: 'click',
                    hide: 'unfocus',
                    style: {
                        tip: true,
                        classes: 'qtip-light'
                    }
                })
            }
        })
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

