import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import * as base64 from 'base-64';
import { PaymentDto } from './models/dto/payment.dto';
import { envKeys } from '../config/config.keys';
import { RequestPaymentDto } from './models/dto/request-payment.dto';
import { AccessTokenResponse } from './models/access-token.dto';
import { RecordInvalidException } from '../shared/error/exceptions/record-invalid-exception';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly lipaNaMpesaOnlinePasskey: string;
  private readonly paybillNumber: number;
  private readonly accountReference: string;

  constructor(private readonly configService: ConfigService) {
    this.consumerKey = this.configService.get<string>(
      envKeys.MPESA_CONSUMER_KEY,
    );
    this.consumerSecret = this.configService.get<string>(
      envKeys.MPESA_CONSUMER_SECRET,
    );
    this.lipaNaMpesaOnlinePasskey = this.configService.get<string>(
      envKeys.MPESA_PASSKEY,
    );
    this.paybillNumber = this.configService.get<number>(
      envKeys.MPESA_PAYBILL_NUMBER,
    );
    this.accountReference = this.configService.get<string>(
      envKeys.MPESA_ACCOUNT_REFERENCE,
    );
  }

  async lipaNaMpesaOnline(
    data: RequestPaymentDto,
  ): Promise<AxiosResponse<any>> {
    this.logger.log(
      `Service [lipaNaMpesaOnline] make payment request with phone number: ${this.formatPhoneNumber(data.phoneNumber)} and amount: ${data.amount}`,
    );
    const accessToken = await this.generateAccessToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3);

    const password = base64.encode(
      `${this.paybillNumber}${this.lipaNaMpesaOnlinePasskey}${timestamp}`,
    );

    const payload: PaymentDto = {
      BusinessShortCode: this.paybillNumber,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: data.amount,
      PartyA: this.formatPhoneNumber(data.phoneNumber),
      PartyB: this.paybillNumber,
      PhoneNumber: this.formatPhoneNumber(data.phoneNumber),
      CallBackURL: 'https://mydomain.com/path',
      AccountReference: this.accountReference,
      TransactionDesc: 'Payment for something',
    };

    return axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      JSON.stringify(payload),
      {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  private async generateAccessToken(): Promise<AccessTokenResponse> {
    const credentials = `${this.consumerKey}:${this.consumerSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await axios.get<AccessTokenResponse>(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );

    return response.data;
  }

  // Format phone number
  private formatPhoneNumber(phoneNumber: string): number {
    let formattedNumber: string;

    if (phoneNumber.startsWith('0')) {
      formattedNumber = `254${phoneNumber.slice(1)}`;
    } else if (phoneNumber.startsWith('254')) {
      formattedNumber = phoneNumber;
    } else if (phoneNumber.startsWith('+254')) {
      formattedNumber = phoneNumber.slice(1);
    } else {
      const errorMessage = `Invalid phone number format: ${phoneNumber}`;
      const clientStatusCode = 'RGX422';
      throw new RecordInvalidException(errorMessage, clientStatusCode);
    }

    // Convert the formatted string to a number
    return Number(formattedNumber);
  }
}
