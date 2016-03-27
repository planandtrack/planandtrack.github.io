var MyQtip=function(calendaredit) {

	function generateDateTimePicker(text,clazz) {
		outer=$("<div class='bubble-date-time-picker " + clazz + "'></div>")
		$(outer).append("<div class='bubble-date-time-picker-text " + clazz + "'>"+text+"</div>")
		datepicker=$("<input class='bubble-date-picker " + clazz + "'></input")
		$(outer).append(datepicker)
		timepicker=$("<input class='bubble-time-picker pull-right " + clazz + "'></input")
		$(outer).append(timepicker)
		return [outer,datepicker,timepicker]
	}

	// title of qtip

	titlediv = $("<div class='my-qtip-title'></div>")
	titlestatic= $("<div class='bubble-title'></div>")
	$(titlediv).append(titlestatic)
	titleedit=$("<input class='title-form'></input>")
	$(titlediv).append(titleedit)

	// content of qtip

	contentdiv = $("<div class='my-qtip-content'></div>")

    // time
	timediv=$("<div class='bubble-time'></div>")
	timestatic=$("<div class='bubble-time-static'></div>")
	$(timediv).append(timestatic)
	timeedit=$("<div class='bubble-time-edit'></div>")
	frompicker=generateDateTimePicker("From","from-date")
	topicker=generateDateTimePicker("To","to-date")
	$(timeedit).append(frompicker[0])
	$(timeedit).append(topicker[0])
    $(timediv).append(timeedit)
    $(contentdiv).append(timediv)
  
  	//calendar
    calendardiv = $("<div class='bubble-calendar'></div>")
    $(calendardiv).append("<span>Calendar: </span>")
    calendarstatic=$("<span class='bubble-calendar-name'></span>")
    calendardiv.append(calendarstatic)
    calendardiv.append(calendaredit)
    $(contentdiv).append(calendardiv)

    //buttons
    buttondiv=$("<div></div>")
    cancelbutton = $("<button class='bubble-cancel-button'>cancel</button>")
    $(buttondiv).append(cancelbutton)
    savebutton = $("<button class='bubble-save-button pull-right'>save</button>")
    $(buttondiv).append(savebutton)
    $(contentdiv).append(buttondiv)

    datepair(timediv)

	$(titlediv).click(function() {
        $(titlestatic).hide()
        $(titleedit).show()
        $(buttondiv).show()
    })

    $(timediv).click(function() {
        $(timestatic).hide()
        $(timeedit).show()
        $(buttondiv).show()
    })
    $(calendardiv).click(function() {
        $(calendarstatic).hide()
        $(calendaredit).show()
        $(buttondiv).show()
    })

    this.getContent = function() {
    	return contentdiv
    }

    this.getTitle = function() {
    	return titlediv
    }

    this.setClickHandler = function(element) {
    	$(savebutton).unbind('click')
    	$(savebutton).click(function() {
	    	element.qtip('hide')
	    })
    	$(cancelbutton).unbind('click')
	    $(cancelbutton).click(function() {
	    	element.qtip('api').hide("cancel-button")
	    })
    }

    this.updateEvent = function(event) {
        event.title=$(titleedit).val()
        event.start=calculatedate($(frompicker[1]).val(),$(frompicker[2]).val())
        event.end=calculatedate($(topicker[1]).val(),$(topicker[2]).val())
    }

	function formatTime(start,end) {
		if (start.month() == end.month() && start.date() == end.date()) {
			var weekday = start.localeData().weekdaysShort(start);
			var date = start.format('LL');
			return weekday + ", " + date  + ", " + start.format('LT') + "-" + end.format('LT');
		}
	}

    this.update = function(event,calendars) {
    	//title
    	titlestatic.text(event.title)
    	titleedit.val(event.title)

    	//content
    	//time
    	var start = event.start;
	    var end = event.end;
	    $(timestatic).text(formatTime(start,end))

	    $(frompicker[1]).val(start.format("L"))
	    $(frompicker[2]).timepicker("setTime",start)
	    $(topicker[2]).timepicker("setTime",end)
        $(topicker[1]).val(end.format("L")).change()

	    //calendar
	    var calId = event.source.events()
	    var calName
	    for (var key in calendars) {
	        if (calendars.hasOwnProperty(key) && key == calId) {
	            calName = calendars[key].name;
	            break
	        }
	    }
	    $(calendarstatic).text(calName)
	    $(calendaredit).val(calId)
    }

    this.initialize = function() {
    	$(titlestatic).show()
        $(titleedit).hide()

        $(timestatic).show()
        $(timeedit).hide()

        $(calendarstatic).show()
        $(calendaredit).hide()

        $(buttondiv).hide()
    }
}