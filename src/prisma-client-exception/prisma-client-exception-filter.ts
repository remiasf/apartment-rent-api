import { Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        console.log(`Catched Error with code: ${exception.code}`);

        const ctx = host.switchToHttp();

        const response = ctx.getResponse();

        switch (exception.code) {
            case 'P2002': {
                const status = HttpStatus.CONFLICT;
                response.status(status).json({
                    statusCode: status,
                    message: 'Record with this unique field already exists'
                });
                break;
            }
                
                

            case 'p2025': {
                const status = HttpStatus.NOT_FOUND;
                response.status(status).json({
                    statusCode: status,
                    message: 'The requested record was not found'
                });
                break;
            }
                
            
        
            default:
                super.catch(exception, host);
                break;
        }
    }
}