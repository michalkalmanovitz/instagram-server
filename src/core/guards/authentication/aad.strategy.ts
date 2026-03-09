import { BearerStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import click_config from './clickConfig';
import { ConfigService } from '@nestjs/config';
/**
 * PassportStrategy determines the way the authentication will be executed, usually a validation method needs
 * to be implemented, when doing this, but the default implementation is enough when using bearer strategy.
 * this part is responsible for azure sign in.
 */
@Injectable()
export class AADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-auth-bearer', //name, could be what ever you want, just make sure that other places that refer to this string are changed as well
) {
  constructor(private readonly configService: ConfigService) {
    super({
      identityMetadata: `https://${
        click_config.metadata.authority
      }/${configService.get<string>('AZURE_TENANT_ID')}/${
        click_config.metadata.version
      }/${click_config.metadata.discovery}`,
      issuer: `https://${
        click_config.metadata.authority
      }/${configService.get<string>('AZURE_TENANT_ID')}/${
        click_config.metadata.version
      }`,
      scope: ['access'],
      //identityMetadata this should stay the same and not be changed for the authentication to work
      clientID: configService.get<string>('AZURE_CLIENT_ID') ?? '', //application id should be written in the dotenv here we use it,
      // Don't change other things, unless you know what you are doing
      loggingNoPII: false, //prints a lot of things related to login, consider on production to make it false
      validateIssuer: true,
      loggingLevel: 'error',
      passReqToCallback: false,
      //TL:DR - go to app Registration->Expose API->Add Scope, fill the fields, and write the scope you added here.
      //for reference use Architect Template App in app registration.
      //if you are stuck, ask צוות תחום דיגיטל
    });
  }

  validate(token, done) {
    return done(null, token);
  }
}
