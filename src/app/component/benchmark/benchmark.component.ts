import {Component, OnInit} from '@angular/core';
import {DataProcessingService} from "../../service/data-processing.service";
import {DataElement, DataElementsKeys} from "../../type/data";

import {DataGeneratorService} from "../../service/data-generator.service";
import {StringHelper} from "../../utils/string-helper";
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

@Component({
  selector: 'app-benchmark',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  templateUrl: './benchmark.component.html',
  styleUrl: './benchmark.component.scss'
})
export class BenchmarkComponent implements OnInit {

  benchMarkData: PerformanceEntryList = []
  columnDefinitions: ColDef[] = [];
  private jwk: JsonWebKey | undefined

  constructor(private dataProcessingService: DataProcessingService,
              private dataGeneratorService: DataGeneratorService) {

    this.columnDefinitions = [
      { field: 'name', sortable: true },
      {  field: 'duration', sortable: true },
      {  field: 'entryType', sortable: true },
      {  field: 'startTime', sortable: true }
    ];
  }

  async ngOnInit() {


    /* Generate an encryption key from a password */
    this.jwk = await this.dataProcessingService.generateSecretKey('put a super awesome password here')

    /* Start Pulling data*/
    this.dataGeneratorService.dataStream$.subscribe(this.handleNewData.bind(this));
  }

  async handleNewData(data: DataElement[]) {
    let perfResult = []
    if(typeof this.jwk === 'undefined'){
      throw new Error('key not initialised')
    }

    /* Encrypt Data */
    performance.mark('Benchmark:start:encrypt');
    const encryptedData = []
    for(const element of data){
      console.log(`Encrypt ${element.id} : ${element.dateCreated} `)
      const encData = await this.dataProcessingService.encrypt(element, this.jwk)
      encryptedData.push(encData)
    }
    performance.mark('Benchmark:end:encrypt');
    perfResult.push(performance.measure('benchmark:encrypt','Benchmark:start:encrypt','Benchmark:end:encrypt'));





    /* Decrypt Data */
    performance.mark('Benchmark:start:decrypt');
    const jsonData = []
    for(const cipherData of encryptedData) {
      const decData = await this.dataProcessingService.decrypt(cipherData, this.jwk)
      console.log(`Decrypted ${jsonData.length} `)
      jsonData.push(decData)
    }
    performance.mark('Benchmark:end:decrypt');
    perfResult.push(performance.measure('benchmark:decrypt','Benchmark:start:decrypt','Benchmark:end:decrypt'));



    /* Re-hydrate Data */
    performance.mark('Benchmark:start:hydrate');
    const toBeProcessedData = []
    for(const json of jsonData) {
      const obj = JSON.parse(json)
      console.log(`Restored ${obj.id} : ${obj.dateCreated} `)
      toBeProcessedData.push(obj)
    }
    performance.mark('Benchmark:end:hydrate');
    perfResult.push(performance.measure('benchmark:hydrate','Benchmark:start:hydrate','Benchmark:end:hydrate'));






    /* Do some more processing, ( it will combine item, this is to generate some slow task ) */
    performance.mark('Benchmark:start:combining');
    const finalData = []
    let loop = 1
    for( let i = 0 ; i < toBeProcessedData.length; i ++) {
      for( let j = toBeProcessedData.length - 1; j >= 0; j--) {

        const left: DataElement = toBeProcessedData[i] ;
        const right: DataElement = toBeProcessedData[j] ;

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

        console.log(`Final processing progress ${loop}/${(toBeProcessedData.length*toBeProcessedData.length)}`)
        loop++
        finalData.push(result)

      }
    }
    performance.mark('Benchmark:end:combining');
    perfResult.push(performance.measure('benchmark:combining','Benchmark:start:combining','Benchmark:end:combining'));


    /* End of benchmark*/
    this.benchMarkData = perfResult
  }


}
