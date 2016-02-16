function getCalendar(date, calendars) {
	var calendaredit = $("<select class='calendar-select' style='display:none'></select>")
	var eventSources = [];
    iterateObject(calendars, function(id,cal){
        if (cal.showCal) {
            eventSources.push({
                events: loadGcalOauth(id),
                color: cal.color
            });
            $(calendaredit).append("<option value='"+id+"'>" + cal.name + "</option>")
        }
    })
    myqtip = new MyQtip(calendaredit);

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
        selectable: true,
        selectHelper: function(start, end) {
            return $("<div style='background:red'> test </div>")
        },
        select: function(start, end, jsevent,view) {
            console.log(start)
            console.log(end)
            console.log(jsevent)
            console.log(view)
        },
        eventRender: function(event, element, view) {
            // Grab event data
            var title = event.title;
            element.qtip({
                content: {
                    title: myqtip.getTitle(),
                    text: myqtip.getContent()
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
                        myqtip.update(event,calendars)
                        myqtip.setClickHandler(element)
                        myqtip.initialize()
                    	// $(this).qtip('api').set('content.title',generateBubbleTitle(event))
                     //    updateBubbleText(event,this,calendars,calendarselector)

                    },
                    hide: function(trigger,api) {
                        var oEvent = trigger.originalEvent;
                        // If we clicked something in the datepicker... don't hide!
                        if(oEvent && ($(oEvent.target).closest('.ui-datepicker').length)) {
                            trigger.preventDefault();
                            return;
                        }
                        // If we clicked something in the timepicker... don't hide!
                        if(oEvent && ($(oEvent.target).closest('.ui-timepicker-wrapper').length)) {
                            trigger.preventDefault();
                            return;
                        }
                        if (oEvent.type=="cancel-button") {
                            return;
                        }

                        myqtip.updateEvent(event)
						$('#calendar').fullCalendar('updateEvent',event)
                    }
                }
            })
        }
    }
    return options
}

$(document).ready(function() {
	$.datepicker.parseDate = function(format, value) {
    	return moment(value, format).toDate();
	};
	$.datepicker.formatDate = function (format, value) {
	    return moment(value).format(format);
	};
})