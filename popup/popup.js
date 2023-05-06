
chrome.storage.local.get(["url"], function (result) {
    document.getElementById("url").value = result["url"];
    console.log("URL loaded: ", result["url"])
});

chrome.storage.local.get(["token"], function (result) {
    document.getElementById("token").value = result["token"];
    console.log("Token loaded: ", result["token"])
});

document.getElementById('saveBtn').addEventListener('click', () => {
    urlValue = document.getElementById("url").value
    tokenValue = document.getElementById("token").value

    chrome.storage.local.set({ "url": urlValue }, function () {
        console.log('Value saved:', urlValue);
    });

    chrome.storage.local.set({ "token": tokenValue }, function () {
        console.log('Value saved:', tokenValue);
    });
});
