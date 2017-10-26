// const target_url = "http://ws-tcg.com/cardlist/#searchResults"
// const grab_targets_selector = 'h4 > a'

$(document).ready(() => {
    $("#grab_start").click(() => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.storage.local.set({error_data: []})
            chrome.extension.sendMessage({ action: 'start_grab', tab_id: tabs[0].id})
        })
        
    })
})



