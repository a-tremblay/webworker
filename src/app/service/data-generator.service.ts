import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataElement} from "../type/data";
import {StringHelper} from "../utils/string-helper";

const BATCH_SIZE= 25
@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {

  dataStream$:Observable<DataElement[]>;

  constructor() {
    this.dataStream$ = new Observable((subscriber) => {
      const data = []
      for(let i = 0 ; i <  BATCH_SIZE; i++) {
        let d = this.generateAnElement()
        data.push(d);
      }
      subscriber.next(data);
    });
  }

  private generateAnElement(): DataElement {

    return {
      id: crypto.randomUUID(),
      message: "===== This is a 1000 char message =====\n " + this.randomString(1000),
      somethingHeavy: "===== This is a 50000 char message =====\n " + this.randomString(50000),
      dateCreated: new Date()
    }
  }

  private randomString(length: number) {

    const randomChar = crypto.getRandomValues(new Uint8Array(length));
    return StringHelper.ab2b64(randomChar.buffer)

  }

}

