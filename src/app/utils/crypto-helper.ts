export class CryptoHelper {

  async getKeyMaterial() {
    let input = 'JULIiyXdF0z@#OK3Ps8wx#jLZfguBF4v4!@c&LEO' + new Date();
    let enc = new TextEncoder();
    return crypto.subtle.importKey(
      "raw",
      enc.encode(input), {
        name: "PBKDF2"
      },
      false, ["deriveBits", "deriveKey"]
    );
  }

 async getKey(){

   const keyMaterial = this.getKeyMaterial()
   const salt = crypto.getRandomValues(new Uint8Array(16));

   return await crypto.subtle.deriveKey({
       "name": "PBKDF2",
       salt: salt,
       "iterations": 100000,
       "hash": "SHA-256"
     },
     keyMaterial, {
       "name": "AES-GCM",
       "length": 256
     },
     true, ["encrypt", "decrypt"]
   );
 }


  //
  // Run the encryption algorithm with the key and data.
  //

  const messageEncryptedUTF8 = await window.crypto.subtle.encrypt(
    algorithm,
    key,
    messageUTF8,
  );

  //
  // Export Key
  //
  const exportedKey = await window.crypto.subtle.exportKey(
    'raw',
    key,
  );

  // This is where to save the exported key to the back-end server,
  // and then to fetch the exported key from the back-end server.

  //
  // Import Key
  //
  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    exportedKey,
    "AES-GCM",
    true, [
      "encrypt",
      "decrypt"
    ]
  );
}
