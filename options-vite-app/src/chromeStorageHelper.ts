export function writeAnObjectToLocalStorage(key: string, value: any) {
    chrome.storage.local.set({ [key]: JSON.stringify(value) });
}

export function getAnObjectFromLocalStorage(key: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            if (result[key]) {
                resolve(JSON.parse(result[key]));
            } else {
                resolve(null)
            }
        });
    });
}