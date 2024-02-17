import {StringHelper} from "./string-helper";
import {CipherData} from "../type/typeDefinition";



/**
 * Simple Class to enc/dec
 */
export class CryptoHelper {

  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private readonly passwordSalt: Uint8Array;

  constructor() {
    this.passwordSalt = crypto.getRandomValues(new Uint8Array(16));
  }


  async generateSecretKey(password: string){
    const key = await this.getDeriveKey(password)
    return await crypto.subtle.exportKey(
      'jwk',
      key,
    )
  }


  private async getKeyMaterial(secret: string | undefined) {

    return crypto.subtle.importKey(
      "raw",
      this.encoder.encode(secret), {
        name: "PBKDF2"
      },
      false, ["deriveBits", "deriveKey"]
    );
  }

  private async getDeriveKey(secret: string) {

    const keyMaterial = await this.getKeyMaterial(secret)
    return await crypto.subtle.deriveKey({
        "name": "PBKDF2",
        salt: this.passwordSalt,
        "iterations": 1000000, // Adding a bit of CPU time * 10
        "hash": "SHA-256"
      },
      keyMaterial, {
        "name": "AES-GCM",
        "length": 256
      },
      true, ["encrypt", "decrypt"]
    );
  }

  async encrypt(data: object, key: JsonWebKey) {

    const initialisationVector = crypto.getRandomValues(new Uint8Array(12));
    const buffer = this.encoder.encode(JSON.stringify(data));
    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      key,
      "AES-GCM",
      true, [
        "encrypt"
      ]
    );


    const ciphertext = await crypto.subtle.encrypt(
      {
        iv: initialisationVector,
        name: "AES-GCM",
        tagLength: 128,
      },
      cryptoKey,
      buffer,
    );

    const encryptedDataBase64 = StringHelper.ab2b64(ciphertext); // Fix: Apply proper ArrayBuffer to Base64 conversion
    const initializationVectorBase64 = StringHelper.ab2b64(initialisationVector); // Fix: Apply proper ArrayBuffer to Base64 conversion


    return { ciphertext: encryptedDataBase64, iv: initializationVectorBase64 } as CipherData
  }

  async decrypt(encryptedData: CipherData, key: JsonWebKey){

    const importedKey = await crypto.subtle.importKey(
      'jwk',
      key,
      "AES-GCM",
      true, [
        "decrypt"
      ]
    );

    const initializationVector = StringHelper.b642ab(encryptedData.iv); // Fix: Apply proper Base64 to ArrayBuffer conversion
    const payload = StringHelper.b642ab(encryptedData.ciphertext); // Fix: Apply proper Base64 to

    try{
      const decryptedPayload = await crypto.subtle.decrypt(
        {
          iv: initializationVector,
          name: "AES-GCM"
        },
        importedKey,
        payload
      );

      return this.decoder.decode(decryptedPayload)
    } catch (e){
      console.log(e)
    }

    return ''
  }


}



