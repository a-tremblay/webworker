import { Injectable } from '@angular/core';
import {DataElement} from "../type/data";
import {CipherData, CryptoHelper} from "../utils/crypto-helper";

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


  async encrypt(payload: object, jwk: JsonWebKey){
    return await this.cryptoLib.encrypt(payload,jwk)
  }

  async decrypt(payload: CipherData, secretKey: JsonWebKey){
    return await this.cryptoLib.decrypt(payload,secretKey)
  }

  async lookup(){}

  async castToObject(){}


}
