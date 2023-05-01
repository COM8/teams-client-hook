// origin is defined somewhere above
chrome.webRequest.onBeforeRequest.addListener((details) => {
    console.error(details)
}, {
    urls: ['wss://*'],
    types: ['xmlhttprequest', 'websocket']
},
    ['requestHeaders', 'blocking']);