import { AamcJwtPayloadType, AamcTokenType, Context, OpenIdConfigKeyEnum, UserTypeEnum } from "./context";

export class ApolloContext {
  context: Partial<Context> = {};

  constructor(
    private req: any, 
  ){}

  private async setContextPassport(): Promise<void> {

    if(this.context?.verifiedJwt?.openIdConfigKey === OpenIdConfigKeyEnum.APPLICANT_PORTAL){
      let tokenPayload = this.context.verifiedJwt.payload as AamcJwtPayloadType;
  
      this.context.aamcToken = {
        aamcExternalId: tokenPayload.sub.toLowerCase(),
        aamcId: tokenPayload.aamcId
      } as AamcTokenType;
  
      if(tokenPayload.sn !== undefined) this.context.aamcToken.lastName = tokenPayload.sn;
      const firstName = tokenPayload.givenName ?? ""
      const middleName = tokenPayload.initials ?? "";
      this.context.aamcToken.restOfName = (`${firstName} ${middleName}`).trim();
      if(tokenPayload.suffix !== undefined) this.context.aamcToken.generationSuffix = tokenPayload.suffix;
      if(tokenPayload.aamcGender !== undefined) this.context.aamcToken.gender = tokenPayload.aamcGender;
      if(tokenPayload.aamcBirthDate !== undefined) this.context.aamcToken.dateOfBirth = `${tokenPayload.aamcBirthDate}T00:00:00.000Z`; 
      if(tokenPayload.email !== undefined) this.context.aamcToken.email = tokenPayload.email;
      if(tokenPayload.aamcCitizenshipCountry !== undefined) this.context.aamcToken.citizenshipCountryCode = tokenPayload.aamcCitizenshipCountry;
      if(tokenPayload.aamcBirthCity !== undefined) this.context.aamcToken.birthCity = tokenPayload.aamcBirthCity;
      if(tokenPayload.aamcBirthState !== undefined) this.context.aamcToken.birthStateCode = tokenPayload.aamcBirthState;
      if(tokenPayload.aamcBirthStateForeign !== undefined) this.context.aamcToken.birthStateForeign = tokenPayload.aamcBirthStateForeign;
      if(tokenPayload.aamcBirthCounty !== undefined) this.context.aamcToken.birthCounty = tokenPayload.aamcBirthCounty;
      if(tokenPayload.aamcBirthCountry !== undefined) this.context.aamcToken.birthCountryCode = tokenPayload.aamcBirthCountry;
  
      this.context.user = {
        id: this.context.aamcToken.aamcExternalId,
        name: `${this.context.aamcToken.restOfName} ${this.context.aamcToken.lastName}`,
        email: this.context.aamcToken.email,
        userType: UserTypeEnum.APPLICANT
      }
      return;
    }
  
    if(this.context?.verifiedJwt?.openIdConfigKey === OpenIdConfigKeyEnum.FUNCTION){
      this.context.functionToken = this.context.verifiedJwt.payload //as FunctionTokenType;
      this.context.user = {
        id: this.context.functionToken.functionName,
        userType: UserTypeEnum.SYSTEM
      }
      return;
    }
    return;
  }

  private async setContextVerifiedJwt(): Promise<void> {
    let verifiedJwtHeader = JSON.parse(this.req.request.headers['verified-jwt'])
    switch(verifiedJwtHeader.openIdConfigKey){
      case OpenIdConfigKeyEnum.APPLICANT_PORTAL:
        this.context.verifiedJwt = {
          payload: {
            sub: '00000000-0000-0000-0000-00000000000',
            aamcId: 'A00000000',
            givenName: 'ReadOnly',
            sn: 'User',
            email: 'readonly.user@example.com',
            aamcCitizenshipCountry: 'US',
            aamcBirthCountry: 'US',
            aamcBirthState: 'CA',
            aamcBirthCity: 'Los Angeles',
            aamcBirthDate: '1900-01-01',
            aamcGender: 'U',
            aamcIdpId: '00000000-0000-0000-0000-00000000000',
            aamcIdpName: 'EFDO Tests',
          } as AamcJwtPayloadType, 
          openIdConfigKey: OpenIdConfigKeyEnum.APPLICANT_PORTAL
        }
        break;
      case OpenIdConfigKeyEnum.FUNCTION:
        this.context.verifiedJwt = {
          payload: {
            functionName: 'readonly-function',
            functionId: '00000000-0000-0000-0000-00000000000',
          }, // as FunctionTokenType, 
          openIdConfigKey: OpenIdConfigKeyEnum.FUNCTION
        }
        break;
      default:
        break;
    }
  }

  private async setFunctionContext(): Promise<void> {
    this.context.functionContext = this.req?.context;
  }

  public static async getContext(
    req: any, 
  ): Promise<Partial<Context>> {
    const apolloContext = new ApolloContext(
      req,
    );


    await apolloContext.setFunctionContext();
    await apolloContext.setContextVerifiedJwt();
    await apolloContext.setContextPassport();

    // console.log(`apollo-context | ${JSON.stringify(apolloContext.context.verifiedJwt)} | ${JSON.stringify(apolloContext.context.user)}`);
    return apolloContext.context;

  }
}

