import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResPonseOB,PageResponse } from '../utils/api.interface'
const { format } = require('date-fns');

@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const formatObj = (data)=>{
      if (data instanceof Array) {
        data.forEach(element => {
          if (element instanceof Object) {
            if (element.createDate) {
              element.createDate = formatLocalDateTime(element.createDate);
            }
            if (element.updateDate) {
              element.updateDate = formatLocalDateTime(element.updateDate)
            }
            if (element.data) {
              formatObj(element.data)
            }
          }
        });
      } else if (data instanceof Object) {
        if (data.createDate) {
          data.createDate = formatLocalDateTime(data.createDate);
        }
        if (data.updateDate) {
          data.updateDate = formatLocalDateTime(data.updateDate)
        }
        if (data.data) {
          formatObj(data.data)
        }
      }
    }
    return next.handle().pipe(
      map(data => {
        formatObj(data.data)
        return data;
      }),
    );
  }
}
function formatLocalDateTime(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss', { useAdditionalWeekYearTokens: false });
}