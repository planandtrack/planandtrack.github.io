function loadGcalOauth(id) {
    return function(start, end, timezone, callback) {
        if (start == null && end == null) {
            return id;
        }
        deferUntilGCal(function() {
            if (!start.hasZone()) {
              start = start.clone().utc().add(-1, 'day');
            }
            if (!end.hasZone()) {
              end = end.clone().utc().add(1, 'day');
            }
            var timezoneArg; // populated when a specific timezone. escaped to Google's liking
            // when sending timezone names to Google, only accepts underscores, not spaces
            if (timezone && timezone != 'local') {
              timezoneArg = timezone.replace(' ', '_');
            }

            var request = gapi.client.calendar.events.list({
                'calendarId': id,
                'timeMin': start.format(),
                'timeMax': end.format(),
                'timeZone': timezoneArg,
                'showDeleted': false,
                'singleEvents': true,
                'orderBy': 'startTime'
            });

            request.execute(function(resp) {
                var gEvents = resp.items;
                var events = [];

                for (i = 0; i < gEvents.length; i++) {
                    var event = gEvents[i];
                    events.push({
                        title: event.summary,
                        start: event.start.dateTime, // will be parsed
                        end: event.end.dateTime
                    });
                }
                callback(events);
            });
        });
    };
};