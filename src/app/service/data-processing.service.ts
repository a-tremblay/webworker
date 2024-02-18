import { Injectable } from '@angular/core';
import {CipherData, DataElement, DataElementsKeys} from "../type/typeDefinition";
import {CryptoHelper} from "../utils/crypto-helper";
import {StringHelper} from "../utils/string-helper";

@Injectable({
  providedIn: 'root'
})
export class DataProcessingService {

  private cryptoLib: CryptoHelper;
  constructor() {
    this.cryptoLib = new CryptoHelper()
  }



  /**
   * The same password will generate the same key unless the passwordSalt change in CryptoHelper
   * @param password
   */
  async generateSecretKey(password:string){
    return await this.cryptoLib.generateSecretKey(password)
  }

  /**
   * Processing function 1 : Encrypt some data
   * @param payload
   * @param jwk
   */
  async encrypt(payload: DataElement[], jwk: JsonWebKey){

    const encryptedData = []
    for(const element of payload){
      const encData = await this.cryptoLib.encrypt(element,jwk)
      encryptedData.push(encData)
      console.log(`Encrypted ${element.id} : ${element.dateCreated} `)
    }

    return encryptedData
  }

  /**
   * Processing function 2 : Decrypt some data
   * @param payload
   * @param secretKey
   */
  async decrypt(payload: CipherData[], secretKey: JsonWebKey){
    const jsonData = []
    for(const cipherData of payload) {
      const decryptedData = await this.cryptoLib.decrypt(cipherData,secretKey)
      jsonData.push(decryptedData)
      console.log(`Decrypt element of length : ${decryptedData.length} `)
    }
    return jsonData
  }
  /**
   * Processing function 3 : Cast some json text back to an object
   * @param jsonObjects
   */
  async hydrate(jsonObjects: string[]) {
    const dataElements: DataElement[] = []
    for(const json of jsonObjects) {
      const obj = JSON.parse(json) as DataElement
      dataElements.push(obj)
      console.log(`Restored ${obj.id} : ${obj.dateCreated} `)
    }

    return dataElements
  }

  /**
   * Processing function 4 : Do some heavy processing on strings and combine elements in some ways
   * @param payload
   */
  async hashCombine(payload: DataElement[]){
    const finalData = []
    let loop = 1
    for( let i = 0 ; i < payload.length; i ++) {
      for( let j = payload.length - 1; j >= 0; j--) {

        const left: DataElement = payload[i] ;
        const right: DataElement = payload[j] ;

        let result: DataElement = {
          id: left.id + '||' + right.id,
          message: '',
          somethingHeavy: '',
          dateCreated: new Date()
        }

        for(const field of ['message' ,'somethingHeavy' ] as DataElementsKeys[]){

          if(field === 'message' || field === 'somethingHeavy'){
            const hashLeft = await crypto.subtle.digest('SHA-1',Uint8Array.from(left[field] as any))
            const hashRight = await crypto.subtle.digest('SHA-1',Uint8Array.from(right[field] as any) )
            result[field] = StringHelper.ab2b64(hashLeft) + StringHelper.ab2b64(hashRight)
          }

        }

        console.log(`Final processing progress ${loop}/${(payload.length*payload.length)}`)
        loop++
        finalData.push(result)

      }
    }

    return finalData
  }




}
