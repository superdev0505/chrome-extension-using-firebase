
var config = {
	apiKey: "AIzaSyBDmZsXrDi6xnUeu_fXmoHh0StKjYCthvk",
	authDomain: "uxunicorns-fca1e.firebaseapp.com",
	databaseURL: "https://uxunicorns-fca1e.firebaseio.com",
	projectId: "uxunicorns-fca1e",
	storageBucket: "uxunicorns-fca1e.appspot.com",
	messageingSenderId: "752488928557"
};


var firedata;


chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.sync.set({
		'uxuicorn_show_type': 'tab',
		'uxuicorn_new_count': 0,
		'uxuicorn_post_count': 0,
		'uxuicorn_first_time': true,
	});
	chrome.browserAction.setBadgeBackgroundColor({color: "#E52034"});
	firebase.initializeApp(config);
	firedata = firebase.database();
});

chrome.browserAction.onClicked.addListener(function(activeTab){
	var newURL = "html/template.html";
	chrome.tabs.create({ url: newURL });
});

chrome.tabs.onCreated.addListener(function(tab) {
	if (tab.url == "chrome://newtab/") {
		chrome.storage.sync.get(['uxuicorn_show_type'], function(result) {
			if (result.uxuicorn_show_type == "tab") {
				var newURL = "html/template.html";
				chrome.tabs.update({ url: newURL });
			}
		})
	}
});

function setnewtab(info, tab) {
	if (info.checked == true) {
    	chrome.storage.sync.set({'uxuicorn_show_type': 'extension'});
    } else {
    	chrome.storage.sync.set({'uxuicorn_show_type': 'tab'});
    }
}



chrome.storage.sync.get(['uxuicorn_show_type'], function(result) {
	var disable_status = false;
	if (result.uxuicorn_show_type == 'extension') {
		disable_status = true;
	}
	chrome.contextMenus.create({
		type: "checkbox",
		title: "Do not open in new tab",
		checked: disable_status,
		contexts:["browser_action"],  // ContextType
		onclick: setnewtab // A callback function
	});
});

function updatedata() {
	chrome.storage.sync.get(['uxuicorn_post_count'], function(result) {
		var old_post_count = result.uxuicorn_post_count;
		firedata.ref("/posts").once('value').then(function(snapshot) {
			var new_post_count = snapshot.numChildren();
			if (new_post_count > old_post_count)
				chrome.browserAction.setBadgeText({text: (new_post_count - old_post_count) > 10 ? "10+": (new_post_count - old_post_count)+""});
		});
	})
	
}


setInterval(updatedata, 15000);