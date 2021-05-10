
let db;

const Chatroom_DB_NAME= 'db_Chatroom';
const Image_STORE_NAME = 'store_image';
const History_STORE_NAME = 'store_history';

async function initDatabase(){
    if (!db) {
        db = await idb.openDB(Chatroom_DB_NAME,2,{
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(Image_STORE_NAME)) {
                    let imageDB = upgradeDb.createObjectStore(Image_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    imageDB.createIndex('image', 'image', {unique: false, multiEntry: true});
                }
                if (!upgradeDb.objectStoreNames.contains(History_STORE_NAME)) {
                    let historyDB = upgradeDb.createObjectStore(History_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    historyDB.createIndex('history', 'history', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;

async function storeCachedData(image, history) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(Image_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(Image_STORE_NAME);
            await store.put(image);
            await tx.complete;

            let tx1 = await db.transaction(History_STORE_NAME, 'readwrite');
            let store1 = await tx.objectStore(History_STORE_NAME);
            await store1.put(history);
            await tx1.complete;
        } catch(error) {
            console.log('error: Could not store the element.' + error);
        };
    }
    else localStorage.setItem('history', JSON.stringify(history));
}
window.storeCachedData= storeCachedData;

async function getCachedData(image,history) {
    if (!db)
        await initDatabase();
    if (db) {
        console.log('fetching: ' + image);
        let tx = await db.transaction(Image_STORE_NAME, 'readonly');
        let store = await tx.objectStore(Image_STORE_NAME);
        let index = await store.index('image');
        let readingsList = await index.getAll(IDBKeyRange.only(image));
        await tx.complete;

        let tx1 = await db.transaction(History_STORE_NAME, 'readonly');
        let store1 = await tx1.objectStore(History_STORE_NAME);
        let index1 = await store1.index('history');
        let readingsList1 = await index1.getAll(IDBKeyRange.only(history));
        await tx1.complete;
        let finalResults=[];
        for (let elem of readingsList)
            finalResults.push(elem);

        let finalResults1=[];
        for (let elem of readingsList1)
            finalResults1.push(elem);
        return finalResults,finalResults1;
    }
}
window.getCachedData= getCachedData;