console.error("Script loaded!!!")

const OriginalWebsocket = window.WebSocket
const ProxiedWebSocket = function () {
    const ws = new OriginalWebsocket(...arguments)
    ws.addEventListener("message", function (e) {
        // Only intercept
        console.error(e.data)
    })
    console.error("Proxy created!!!")
    return ws;
};
window.WebSocket = ProxiedWebSocket;
WebSocket = ProxiedWebSocket;