const pathStore = [];

export function getPathStore() {
    return JSON.parse(localStorage.pathStore);
}

export function addDataToStore(targetList) {
    pathStore.push(targetList);
    localStorage.getItem('pathStore') ?  localStorage.pathStore = JSON.stringify(pathStore) : localStorage.setItem('pathStore', JSON.stringify(pathStore));
    console.log(JSON.parse(localStorage.pathStore));
}
