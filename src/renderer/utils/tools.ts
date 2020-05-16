import { Base64 } from 'js-base64';

const salting = 'papertune';

export function encyptString(str: string) {
  return Base64.encode(str + salting);
}

export function decodeString(str: string) {
  const decodeName = Base64.decode(str) || '';
  return decodeName.split(salting)[0] || '';
}

export function getCookie(cookieName) {
  const strCookie = document.cookie;
  const arrCookie = strCookie.split("; ");
  for(let i = 0; i < arrCookie.length; i++){
      const arr = arrCookie[i].split("=");
      if(cookieName == arr[0]){
          return arr[1];
      }
  }
  return "";
}

export function getDB(dbName = 'papertune'): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onerror = e => {
      reject(e);
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}