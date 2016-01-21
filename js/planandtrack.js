var settingsID;

function loadSettings() {
	deferUntilGDrive(function() {
		var request = gapi.client.drive.files.list();
		//var request = gapi.client.drive.files.list({spaces:'appDataFolder'});
		request.execute(function(resp) {
			console.log(resp);
			var settingsID;
			for (i = 0; i < resp.files.length; i++) {
				if (resp.files[i].name === 'settings') {
					loadSettingsFile(resp.files[i].id);
					return;
				}
			}
			createSettings();
		});
	});
}

function addSettingsToAngular(settings) {
	var scope = angular.element(document.getElementById('contentCtrl')).scope();
	scope.$apply(function() {scope.calendarSettings=settings});
}

function syncSettingsWithCalendar(settings) {
	deferUntilGCal(function() {
		var request = gapi.client.calendar.calendarList.list();
		request.execute(function(resp) {
			console.log(resp);
			for (i = 0; i < resp.items.length;i++) {
				var cal = resp.items[i];
				if (settings.calendars[cal.id]==undefined) {
					settings.calendars[cal.id]={};
				}
				if (settings.calendars[cal.id].showCal==undefined) {
					settings.calendars[cal.id].showCal=false;
				}
				settings.calendars[cal.id].name=cal.summary;
				settings.calendars[cal.id].color=cal.backgroundColor;
			}
			addSettingsToAngular(settings);
		});
	});
}

function loadSettingsFile(fileID) {
	settingsID = fileID;
	var request = gapi.client.drive.files.get({fileId: fileID,alt:"media"});
	request.execute(function(resp) {
		addSettingsToAngular(resp);
		syncSettingsWithCalendar(resp);
	});
}

function saveSettings() {
	var scope = angular.element(document.getElementById('contentCtrl')).scope();
	var settings = scope.calendarSettings;
	updateFileWithJSONContent(settingsID,'settings',JSON.stringify(settings),null);
}

function createSettings() {
	createFileWithJSONContent('settings','{"calendars":{}}',function(resp) {loadSettingsFile(resp.id)})
}

var updateFileWithJSONContent = function(id, name, data, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";
  
  const contentType = 'application/json';

  	var metadata = {
      	'name': name,
      	'mimeType': contentType
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v3/files/'+id,
        'method': 'PATCH',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
}


var createFileWithJSONContent = function(name,data,callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";
  
  const contentType = 'application/json';

  var metadata = {
      'name': name,
      'mimeType': contentType
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n\r\n' +
        data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/related; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
}

//appStart();