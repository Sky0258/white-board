// currentPathStore  historyPathStore
const pathStore = [];

export function getPathStore(storeName) {
    return localStorage.getItem(storeName) ? JSON.parse(localStorage[storeName]) : null;
}

export function addDataToStore(targetList, storeName) {
    pathStore.push(targetList);
    setLocalStorageValue(storeName, JSON.stringify(pathStore));
}

// 工具
export function setLocalStorageValue(key, value) {
    localStorage.getItem(key) ? localStorage[key] = value : localStorage.setItem(key, value);
}

