function getCalendar(date, calendars) {
	var calendarselector = $("<select class='calendar-select' style='display:none'></select>")
	var eventSources = [];
    iterateObject(calendars, function(id,cal){
        if (cal.showCal) {
            eventSources.push({
                events: loadGcalOauth(id),
                color: cal.color
            });
            $(calendarselector).append("<option value='"+id+"'>" + cal.name + "</option>")
        }
    })
	options = {
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
        defaultDate: date,
        editable: true,
        eventRender: function(event, element, view) {
            // Grab event data
            var title = event.title;
            element.qtip({
                content: {
                    title: "test",
                    text: "test2"
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
                	height: 150,
                    tip: true,
                    classes: 'qtip-light'
                },
                events: {
                    show: function() {
                    	$(this).qtip('api').set('content.title',generateBubbleTitle(event))
                    	$(this).qtip('api').set('content.text',generateBubbleText(event,$(this),calendars,$(calendarselector).clone()))
                        
                        $(this).find(".bubble-title").click(function() {
                            $(this).hide()
                            form=$(this).siblings(".title-form")
                            $(form).show()
                            $(this).closest('.qtip').find(".bubble-save-button").show()
                            $(this).closest('.qtip').find(".bubble-cancel-button").show()
                        })
                        $(this).find(".bubble-calendar").click(function() {
                            $(this).find(".bubble-calendar-name").hide()
                            $(this).find(".calendar-select").show()
                            $(this).closest('.qtip').find(".bubble-save-button").show()
                            $(this).closest('.qtip').find(".bubble-cancel-button").show()
                        })
                        $(this).find(".bubble-save-button").click(function() {
                        	element.qtip('hide')
                        })
                        $(this).find(".bubble-cancel-button").click(function() {
                        	//restore old state
                        	$(this).closest('.qtip').find(".title-form").val(event.title)
                        	element.qtip('hide')
                        })
                    },
                    hide: function(trigger,api) {
                        var oEvent = trigger.originalEvent;
                        // If we clicked something in the datepicker... don't hide!
                        if(oEvent && ($(oEvent.target).closest('.ui-datepicker').length)) {
                            trigger.preventDefault();
                        }
                        // If we clicked something in the timepicker... don't hide!
                        if(oEvent && ($(oEvent.target).closest('.ui-timepicker-wrapper').length)) {
                            trigger.preventDefault();
                        }

                    	form=$(this).find(".title-form")
						event.title=$(form).val()
						$('#calendar').fullCalendar('updateEvent',event)
                        $(this).find(".bubble-title").show()
                        $(this).find(".title-form").hide()
                    }
                }
            })
        }
    }
    return options
}

function generateBubbleTitle(event) {
	var titlediv = $("<div class='my-qtip-title'></div>")
	$(titlediv).append("<div class='bubble-title'>" + event.title + "</div>")
	$(titlediv).append("<input class='title-form' style='display:none' value='"+event.title+"'></input>")
	return titlediv;
}

function generateDateTimePicker(date,text) {
	outer=$("<div class='bubble-date-time-picker'></div>")
	$(outer).append("<div class='bubble-date-time-picker-text'>"+text+"</div>")
	$(outer).append("<input class='bubble-date-picker' value='" + date.format("L") + "'></input")
	$(outer).append("<input class='bubble-time-picker pull-right' value='" + date.format("LT") + "'></input")
    dateinput=$(outer).find('.bubble-date-picker')
    $(dateinput).datepicker({dateFormat:"L"})
    $(dateinput).click(function(){
        $(this).datepicker('show');
    });
    $(outer).find('.bubble-time-picker').timepicker()
	return outer
}

function generateBubbleText(event, qtip, calendars,calendarselector) {
	var contentdiv = $("<div class='my-qtip-content'></div>")
	var start = event.start;
	var end = event.end;
	timediv=$("<div class='bubble-time'></div>")
	$(timediv).append("<div>" + formatTime(start,end) + "</div>")
	editdiv=$("<div class='bubble-time-edit'></div>")
	$(editdiv).append(generateDateTimePicker(start,"From"))
	$(editdiv).append(generateDateTimePicker(end,"To"))
	$(timediv).append(editdiv)
	$(contentdiv).append(timediv)
	var calId = event.source.events();
	var calName;
	for (var key in calendars) {
        if (calendars.hasOwnProperty(key) && key == calId) {
           	calName = calendars[key].name;
           	break;
        }
    }
    calendardiv = $("<div class='bubble-calendar'></div>")
    $(calendardiv).append("<span>Calendar: </span><span class='bubble-calendar-name'>"+calName+"</span>")
    $(calendarselector).val(event.source.events())
	$(calendardiv).append(calendarselector)
	$(contentdiv).append(calendardiv)
	buttondiv=$("<div></div>")
	$(buttondiv).append("<button class='bubble-cancel-button' style='display:none' >cancel</button>")
	$(buttondiv).append("<button class='bubble-save-button pull-right' style='display:none' >save</button>")
	$(contentdiv).append(buttondiv)
	return contentdiv;
}

function formatTime(start,end) {
	if (start.month() == end.month() && start.date() == end.date()) {
		var weekday = start.localeData().weekdaysShort(start);
		var date = start.format('LL');
		return weekday + ", " + date  + ", " + start.format('LT') + "-" + end.format('LT');
	}
}

$(document).ready(function() {
	$.datepicker.parseDate = function(format, value) {
    	return moment(value, format).toDate();
	};
	$.datepicker.formatDate = function (format, value) {
	    return moment(value).format(format);
	};
})