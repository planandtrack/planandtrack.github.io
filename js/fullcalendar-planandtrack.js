function generateBubbleTitle(event) {
	var title = "<div class='bubble-title'>" + event.title + "</div>";
	var form = "<input class='title-form' style='display:none'></input>"
	return title + form;
}

$(document).ready(function() {
	$(function(){
	    $(".bubble-title").click(function() {
	        console.log("title clicked")
	        $(this).hide()
	    });
	});
})

function generateBubbleText(event, calendars) {
	var start = event.start;
	var end = event.end;
	var time = "<div class='bubble-time'>" + formatTime(start,end) + "</div>";
	var calId = event.source.events();
	var calName;
	for (var key in calendars) {
        if (calendars.hasOwnProperty(key) && key == calId) {
           	calName = calendars[key].name;
           	break;
        }
    }
	var calendar = "<div class='bubble-calendar'> Calendar: "+ calName + "</div>";
	var cancelButton = "<button class='cancelButton'>cancel</button>"
	var saveButton = "<button class='saveButton pull-right'>save</button>"
	return time + calendar + cancelButton + saveButton;
}

function formatTime(start,end) {
	if (start.month() == end.month() && start.date() == end.date()) {
		var weekday = start.localeData().weekdaysShort(start);
		var date = start.format('LL');
		return weekday + ", " + date  + ", " + start.format('LT') + "-" + end.format('LT');
	}
}