import {Component, OnInit} from '@angular/core';
import {DataProcessingService} from "../../service/data-processing.service";
import {DataElement} from "../../type/data";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-benchmark',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './benchmark.component.html',
  styleUrl: './benchmark.component.scss'
})
export class BenchmarkComponent implements OnInit{

  data: DataElement[] = []

  constructor(private dataProcessingService: DataProcessingService) {
  }

 async ngOnInit(){
   this.data = await this.dataProcessingService.generateData()
 }


}
