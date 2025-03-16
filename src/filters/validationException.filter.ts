import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorsService } from '../errors/errors.service';
import { getFormatedDate } from '../helpers/getFormatedDate';
import { ErrorDto } from '../errors/dto/error.dto';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorsService: ErrorsService) {}

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    try {
      const newError: ErrorDto = {
        type: 'DTO',
        message: exception.getResponse()['message'] || 'Błąd walidacji',
        url: request.url,
        error: 'BadRequestException',
        query: request.body ? JSON.stringify(request.body) : '',
        parameters: '',
        sql: '',
        createdAt: getFormatedDate(),
        createdAtTimestamp: Number(Date.now()),
      };

      await this.errorsService.prepareError(newError);
      console.log('Błąd zapisany w bazie ✅');
    } catch (dbError) {
      console.error('❌ Błąd podczas zapisu błędu w bazie:', dbError);
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.getResponse()['message'] || 'Błąd walidacji',
      error: 'BadRequestException',
    });
  }
}
