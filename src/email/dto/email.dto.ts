import {
  IsString,
  IsNumber,
  IsOptional,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Custom validator : one of clientId or supplierId has to be present
@ValidatorConstraint({ name: 'ClientOrSupplier', async: false })
export class ClientOrSupplierConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.clientId || obj.supplierId);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Either clientId or supplierId must be provided.';
  }
}

export class SendEmailDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsNumber()
  setId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @IsString()
  link: string;

  @Validate(ClientOrSupplierConstraint)
  validateClientOrSupplier: boolean;
}
