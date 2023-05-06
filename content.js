while (document == null || document.head == null);

var s = document.createElement("script");

function hookWebSocket() {
    window.RealWebSocket = window.WebSocket;

    window.WebSocket = function () {
        var socket = new window.RealWebSocket(...arguments);

        socket.addEventListener("message", (e) => {
            // We need to send a message to our extension since in an injected script, we do not have access to chrome.*
            // Extension ID
            var editorExtensionId = "fekcnofjiglkhlhiiodbpbedplghdkfp";
            // Make a simple request:
            chrome.runtime.sendMessage(editorExtensionId, { action: "getTokenUrl" },
                function (response) {
                    fetchUrl = response.url + "?auth=" + response.token
                    console.log("Send to: ", fetchUrl)
                    fetch(fetchUrl, { // Send the auth via query parameter to prevent cors issues
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: e.data
                    }).then(response => console.error("Posted: ", JSON.stringify(response)))
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
