while (document == null || document.head == null);

var s = document.createElement("script");

// Send message directly without first sending a chrome.runtime.sendMessage to the background
function sendToBackground(data) {
    chrome.storage.local.get(["token"], function (token) {
        chrome.storage.local.get(["url"], function (url) {
            fetchUrl = url["url"] + "?auth=" + token["token"];
            console.debug("[Teams Client] Send to: ", fetchUrl);
            fetch(fetchUrl, { // Send the auth via query parameter to prevent cors issues
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: data
            }).then(response => console.debug("[Teams Client] Posted: ", JSON.stringify(data)));
        });
    });
}

function hookWebSocket() {
    window.RealWebSocket = window.WebSocket;

    window.WebSocket = function () {
        var socket = new window.RealWebSocket(...arguments);

        socket.addEventListener("message", (e) => {
            // We need to send a message to our extension since in an injected script, we do not have access to chrome.*
            var extensionID = "fekcnofjiglkhlhiiodbpbedplghdkfp";
            chrome.runtime.sendMessage(extensionID, { action: "getTokenUrl" },
                function (response) {
                    fetchUrl = response.url + "?auth=" + response.token;
                    console.debug("[Teams Client] Send to: ", fetchUrl);
                    fetch(fetchUrl, { // Send the auth via query parameter to prevent cors issues
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: e.data
                    }).then(response => console.debug("[Teams Client] Posted: ", JSON.stringify(response)));
                });
        });

        return socket;
    }
}

s.innerHTML = `
    ${hookWebSocket.toString()}

    hookWebSocket();
`;

document.head.prepend(s);


setInterval(function () {
    let targetNodes = document.querySelectorAll('.activity-badge');
    if (targetNodes.length <= 0) {
        return
    }

    let sum = 0;

    targetNodes.forEach(function (node) {
        // If the node also has the 'activity-badge-container' class, skip it
        if (node.classList.contains('activity-badge-container')) {
            return;
        }

        let value = parseInt(node.textContent.trim(), 10);
        if (!isNaN(value)) { // make sure the content was a number
            sum += value;
        }
    });

    let activityObject = { activity: { count: sum } };
    sendToBackground(JSON.stringify(activityObject));

}, 5000); // 5000 milliseconds = 5 seconds
