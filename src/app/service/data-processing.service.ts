import { Injectable } from '@angular/core';
import {DataElement} from "../type/data";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  constructor() { }


  async generateData(): Promise<DataElement[]>{

    const d :DataElement = {id:"1",code: "dddd"}
    return Promise.resolve().then(() => [d])

  }

  async encrypt(element: string){


    const messageOriginalDOMString = element;

    //
    // Encode the original data
    //

    const encoder = new TextEncoder();
    const messageUTF8 = encoder.encode(messageOriginalDOMString);

    //
    // Configure the encryption algorithm to use
    //

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const algorithm = {
      iv,
      name: 'AES-GCM',
    };

    //
    // Generate/fetch the cryptographic key
    //


    //
    // Run the decryption algorithm with the key and cyphertext.
    //

    const messageDecryptedUTF8 = await window.crypto.subtle.decrypt(
      algorithm,
      importedKey,
      messageEncryptedUTF8,
    );

    //
    // Decode the decryped data.
    //

    const decoder = new TextDecoder();
    const messageDecryptedDOMString = decoder.decode(messageDecryptedUTF8);

    //
    // Assert
    //
    console.log(messageOriginalDOMString);
    console.log(messageDecryptedDOMString);



  }

  async lookup(){}

  async castToObject(){}


}
