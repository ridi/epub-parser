import * as es from 'event-stream';
import type CryptoProvider from './CryptoProvider';
import type { Purpose } from './CryptoProvider';

const createCryptoStream = (filePath: string, totalSize: number, cryptoProvider: CryptoProvider, purpose: Purpose): es.MapStream => {
  let tmpChunk = Buffer.from([]);
  let pushedSize = 0;
  return es.map(async (chunk: Buffer, callback: (nullable?: null, chunk?: Buffer) => void) => {
    const subTotalSize = pushedSize + tmpChunk.length + chunk.length;
    if (subTotalSize < totalSize && subTotalSize % 16 !== 0) {
      tmpChunk = Buffer.concat([tmpChunk, chunk]);
      callback();
    } else {
      const result = cryptoProvider.run(Buffer.concat([tmpChunk, chunk]), filePath, purpose);
      if (Promise.resolve(result) === result) {
        chunk = await chunk;
      }
      pushedSize += chunk.length;
      tmpChunk = Buffer.from([]);
      callback(null, chunk);
    }
  });
};

export default createCryptoStream;
