import {Component, OnInit} from '@angular/core';
import {DataProcessingService} from "../../service/data-processing.service";
import {DataElement} from "../../type/typeDefinition";

import {DataGeneratorService} from "../../service/data-generator.service";
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

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
    const encryptedData = await this.dataProcessingService.encrypt(data, this.jwk)
    performance.mark('Benchmark:end:encrypt');
    perfResult.push(performance.measure('benchmark:encrypt','Benchmark:start:encrypt','Benchmark:end:encrypt'));


    /* Decrypt Data */
    performance.mark('Benchmark:start:decrypt');
    const decData = await this.dataProcessingService.decrypt(encryptedData, this.jwk)
    performance.mark('Benchmark:end:decrypt');
    perfResult.push(performance.measure('benchmark:decrypt','Benchmark:start:decrypt','Benchmark:end:decrypt'));


    /* Re-hydrate Data */
    performance.mark('Benchmark:start:hydrate');
    const toBeProcessedData = await  this.dataProcessingService.hydrate(decData)
    performance.mark('Benchmark:end:hydrate');
    perfResult.push(performance.measure('benchmark:hydrate','Benchmark:start:hydrate','Benchmark:end:hydrate'));


    /* Do some more processing, ( it will combine item, this is to generate some slow task ) */
    performance.mark('Benchmark:start:combining');
    const finalResult = await this.dataProcessingService.hashCombine(toBeProcessedData)
    performance.mark('Benchmark:end:combining');
    perfResult.push(performance.measure('benchmark:combining','Benchmark:start:combining','Benchmark:end:combining'));


    /* End of benchmark*/
    this.benchMarkData = perfResult
  }


}
