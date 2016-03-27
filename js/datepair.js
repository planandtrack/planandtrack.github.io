function datepair(container) {
	fromdate=$(container).find(".bubble-date-picker.from-date")
	fromtime=$(container).find(".bubble-time-picker.from-date")
	todate=$(container).find(".bubble-date-picker.to-date")
	totime=$(container).find(".bubble-time-picker.to-date")

	$(fromdate).datepicker({dateFormat:"L"})
	$(todate).datepicker({dateFormat:"L"})

	$(fromtime).timepicker({useSelect:true})
	$(totime).timepicker({useSelect:true,showDuration:true})

    $(fromdate).click(function(){
        $(this).datepicker('show');
    });

    $(todate).click(function(){
        $(this).datepicker('show');
    });

    dur=3600 // standard duration
    
    $(fromdate).change( function() {
		start=calculatedate(fromdate.val(),fromtime.val())
		end = moment(start).add(dur,'s')
		todate.val(end.format("L"))
		if (start.format("L") == end.format("L")) {
			totime.timepicker('option', 'showDuration', true)
			totime.timepicker('option', 'minTime', start);
		} else {
			totime.timepicker('option', 'showDuration', false)
			totime.timepicker('option', 'minTime', "00:00");
		}
		totime.timepicker("setTime",end)
	})

    $(fromtime).change( function() {
		start=calculatedate(fromdate.val(),fromtime.val())
		end = moment(start).add(dur,'s')
		todate.val(end.format("L"))
		if (start.format("L") == end.format("L")) {
			totime.timepicker('option', 'showDuration', true)
			totime.timepicker('option', 'minTime', start);
		} else {
			totime.timepicker('option', 'showDuration', false)
			totime.timepicker('option', 'minTime', "00:00");
		}
		totime.timepicker("setTime",end)
	})

    $(todate).change( function() {
		start=calculatedate(fromdate.val(),fromtime.val())
		end=calculatedate(todate.val(),totime.val())
		dur=end.diff(start,'s')
		if (start.format("L") == end.format("L")) {
			totime.timepicker('option', 'showDuration', true)
			totime.timepicker('option', 'minTime', start);
		} else {
			totime.timepicker('option', 'showDuration', false)
			totime.timepicker('option', 'minTime', "00:00");
		}
		totime.timepicker("setTime",end)
    })

    $(totime).change( function() {
		start=calculatedate(fromdate.val(),fromtime.val())
		end=calculatedate(todate.val(),totime.val())
		dur=end.diff(start,'s')
    })
}

function calculatedate(date,time) {
	m=moment(date,"L")
	m2=moment(time,"LT")
	m.set('hour',m2.get('hour'))
	m.set('minute',m2.get('minute'))
	return m
}
