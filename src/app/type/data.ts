export interface DataElement  {
  id: string;
  message: string;
  somethingHeavy: string;
  dateCreated: Date;
}


export type DataElementsKeys = keyof DataElement
