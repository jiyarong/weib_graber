const debug_show_tab_info = (text, tab_id) => {
    chrome.tabs.get(tab_id, (tab) => {
        console.log([text, tab_id, tab.url].join(','))
    })
}

var current_tab_id = null
var should_grab_start = false

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == "start_grab") {
        if (request.tab_id == undefined ) {
            _tab_id = current_tab_id
        } else {
            _tab_id = request.tab_id
            current_tab_id = _tab_id
        }
        should_grab_start = true
        chrome.tabs.sendMessage(_tab_id, {action: "start_grab"})
    } else if (request.action == "should_grab_start") {
        if (should_grab_start) {chrome.tabs.sendMessage(_tab_id, {action: "grabing"})}
    }
})

chrome.tabs.onCreated.addListener((tab) => {
    chrome.tabs.executeScript(tab.id, {code: 'grab_info()'})
})