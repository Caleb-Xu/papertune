import { Base64 } from 'js-base64';

const salting = 'papertune';

export function encyptString(str: string) {
  return Base64.encode(name + salting);
}

export function decodeString(str: string) {
  const decodeName = Base64.decode(str) || '';
  return decodeName.split(salting)[0] || '';
}
