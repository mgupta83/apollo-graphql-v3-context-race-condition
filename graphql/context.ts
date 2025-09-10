// import { Passport } from "../domain/contexts/iam/passport";
import { DataSourcesType } from "./data-sources";
import { Context as FunctionContext} from "@azure/functions";

export type Context = {
  verifiedJwt: {
    payload: any;
    openIdConfigKey: OpenIdConfigKeyEnum;
  };
  // passport: Passport; 
  dataSources: DataSourcesType; 
  // executionContext: any;
  functionContext: FunctionContext;
  user?: VerifiedJwtUserType;   //// TO DO: try to normalize the user type (discuss with PG once all token types are known)
  aamcToken?: AamcTokenType;
  functionToken?: any; //FunctionTokenType;
  isSystemUnderMaintenance?: boolean;
  seasonId?: string;
  seasonName?: string;
  isSeasonActive?: boolean;
}

export type VerifiedJwtUserType = {
  id: string;
  name?: string;
  email?: string;
  userType: string;
}


export type AamcTokenType = {
  aamcExternalId: string;
  aamcId: string;
  lastName: string;
  restOfName?: string;
  generationSuffix?: string;
  gender?: string;
  dateOfBirth?: string;
  email: string;
  citizenshipCountryCode?: string;
  birthCity?: string;
  birthStateCode?: string;
  birthStateForeign?: string;
  birthCounty?: string;
  birthCountryCode?: string;
}

export type AamcJwtPayloadType = {
  sub: string;
  aamcId: string;
  sn: string; 
  givenName?: string;
  initials?: string;
  suffix?: string;
  aamcGender?: string;
  aamcBirthDate?: string;
  email: string;
  aamcCitizenshipCountry?: string;
  aamcBirthCity?: string;
  aamcBirthState?: string;
  aamcBirthStateForeign?: string;
  aamcBirthCounty?: string;
  aamcBirthCountry?: string;
}

export type SalesforceJwtPayloadType = {
  sub: string;
  name: string;
  email: string;
}

export type MagicLinkJwtPayloadType = {
  sub: string;
  email: string;
}

 
export interface FunctionBaseJwtPayloadType {
  functionName: string;
}

// import { QueueReceiverTokenPayloadType } from '../services/queue-storage/base-queue-receiver';
// import {TimerTriggerTokenPayloadType} from '../services/timer-trigger/timer-trigger';
// export type FunctionTokenType = QueueReceiverTokenPayloadType | TimerTriggerTokenPayloadType;

export enum OpenIdConfigKeyEnum {
    APPLICANT_PORTAL = 'ApplicantPortal',
    // MIDUS_PORTAL = 'MidusPortal',
    // ADMIN_PORTAL = 'AdminPortal',
    FUNCTION = 'Function'
}

export enum UserTypeEnum  {
    APPLICANT = 'Applicant',
    MIDUS = 'Midus',
    CASE_MANAGEMENT = 'Case Management',
    SYSTEM = 'System',
    UNKNOWN = 'Unknown',
}