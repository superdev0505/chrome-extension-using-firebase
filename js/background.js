chrome.runtime.onInstalled.addListener(function(details){
    var result = confirm("Do you want to get UXUicorn Post when you open a new tab?");
    if (result == true) {
    	chrome.storage.sync.set({'uxuicorn_show_type': 'tab'}, function() {
			alert('Settings saved');
        });
    } else {
    	chrome.storage.sync.set({'uxuicorn_show_type': 'extension'}, function() {
			alert('Settings saved');
        });
    }
});
chrome.browserAction.onClicked.addListener(function(activeTab){
	
	chrome.storage.sync.get(['uxuicorn_show_type'], function(result) {
		var show_type = result.uxuicorn_show_type;
		if (show_type == "extension") {
			chrome.storage.local.set({'uxuicorn_click': 'on'}, function() {});
			var newURL = "html/template.html";
			chrome.tabs.create({ url: newURL });
		}
	});
});