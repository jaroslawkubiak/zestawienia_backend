import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ErrorDto } from '../errors/dto/error.dto';
import { ErrorsService } from '../errors/errors.service';
import { ErrorsType } from '../errors/types/Errors';
import { getFormatedDate } from '../helpers/getFormatedDate';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  constructor(private errorsService: ErrorsService) {}
  async catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // unique error
    if (exception.message.includes('Duplicate entry')) {
      const parts = exception.driverError.message.split("'");
      const duplicateEntry = parts[1];

      const newError: ErrorDto = {
        type: ErrorsType.sql,
        message: 'DUPLIKAT',
        url: 'null',
        error: JSON.stringify(exception?.driverError?.message) || 'null',
        query: JSON.stringify(exception?.query) || 'null',
        parameters: JSON.stringify(exception?.parameters.flat()) || 'null',
        sql: JSON.stringify((exception as any)?.sql) || 'null',
        createdAt: getFormatedDate() || new Date().toISOString(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Wartość : ${duplicateEntry}, już istnieje w bazie danych`,
      });
    }

    // Default error
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Błąd bazy danych',
      error: 'DatabaseError',
    });
  }
}
