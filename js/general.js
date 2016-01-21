function deferUntilCalendar(method) {
    if ($.fullCalendar) {
        method();
	} else {
        setTimeout(function() { deferUntilCalendar(method) }, 100);
	}
}

function deferUntilGCal(method) {
    if (gapi) {
    	if (gapi.client) {
    		if (gapi.client.calendar) {
    			method();
                return;
    		}
    	}
	}
    setTimeout(function() { deferUntilGCal(method) }, 100);
}

function deferUntilGDrive(method) {
    if (gapi) {
        if (gapi.client) {
            if (gapi.client.drive) {
                method();
                return;
            }
        }
    }
    setTimeout(function() { deferUntilGCal(method) }, 100);
}
