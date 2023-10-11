import { HttpStatus } from "@nestjs/common/enums";

export interface ResPonseOB<T>{
    status: HttpStatus
    data?: T,
    message?: T
}

export class PageRequest<T>{
     params: T;
     page: number = 1;
     pageSize: number = 20;
    constructor(params: T) {
      this.params = params;
    }
  }

  export class PageResponse<T>{
    total:number;
    data:T[];
    page:number;
    pageSize:number;
  }