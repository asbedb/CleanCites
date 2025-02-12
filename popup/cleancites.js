let hidden = false;
let highlighted = false;

document.querySelector("#highlightButton").addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if(!highlighted){
            chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight' }, function(response) {
                if (response.status === 'success') {
                    document.querySelector('#statusMessage').textContent = `Highlighted`;
                } else {
                    document.querySelector('#statusMessage').textContent = `Error`;
                }
            });
            highlighted = true;
            document.querySelector("#highlightButton").textContent= 'Remove Highlights';
        }else{
            chrome.tabs.sendMessage(tabs[0].id, { action: 'restore' }, function(response) {
                if (response.status === 'success') {
                    document.querySelector('#statusMessage').textContent = `Restored`;
                } else {
                    document.querySelector('#statusMessage').textContent = `Error`;
                }
            });
            highlighted = false;
            document.querySelector("#highlightButton").textContent = "Highlight Citations"
        }

    });
});

document.querySelector("#hideButton").addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if(!hidden){
            chrome.tabs.sendMessage(tabs[0].id, { action: 'hide' }, function(response) {
                if (response.status === 'success') {
                    document.querySelector('#statusMessage').textContent = `Hidden`;
                } else {
                    document.querySelector('#statusMessage').textContent = `Error`;
                }
            });
            hidden = true;
            document.querySelector("#hideButton").textContent = "Unhide"
        }else{
            chrome.tabs.sendMessage(tabs[0].id, { action: 'restore' }, function(response) {
                if (response.status === 'success') {
                    document.querySelector('#statusMessage').textContent = `Restored`;
                } else {
                    document.querySelector('#statusMessage').textContent = `Error`;
                }
            });
            hidden = false;
            document.querySelector("#hideButton").textContent = "Hide Citations"
        }

    });
});


console.log("loaded")
