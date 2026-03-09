import type { AccessToken } from '@azure/identity';
import { DefaultAzureCredential } from '@azure/identity';
import type { CustomLogger } from '../core/customLogger/customLogger';

export interface IToken {
  accessToken: AccessToken['token'];
}

export class AzureAccessTokenProvider {
  private static token: IToken | null;

  static async getAccessToken(authScope: string, logger: CustomLogger) {
    try {
      await this.initializeToken(authScope, logger);
    } catch {
      this.token = null;
    }

    return this.token?.accessToken;
  }

  private static async initializeToken(
    authScope: string,
    logger: CustomLogger,
  ): Promise<void> {
    logger.log('Getting token from Azure');

    //* For this to work, there have to be `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` and `AZURE_TENANT_ID` env variables
    const credential = new DefaultAzureCredential();

    try {
      const accessToken = await credential.getToken(authScope, {});

      this.token = { accessToken: accessToken.token };
    } catch (e) {
      console.error('Failed to get access token from Azure', e);
      throw e;
    }
  }
}
