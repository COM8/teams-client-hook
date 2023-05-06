chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "getTokenUrl") {
            chrome.storage.local.get(["token"], function (token) {
                chrome.storage.local.get(["url"], function (url) {
                    sendResponse({ token: token["token"], url: url["url"] });
                });
            });
        }
        else {
            console.error("Unknown request message: ", msg)
        }
    });