import { Context } from './context';
import { DataSource, DataSourceConfig } from 'apollo-datasource';

export class DomainDataSource<TContext extends Context> extends DataSource<TContext>{
  private _context: TContext;  

  constructor() { 
    super();
  }

  public get context(): TContext { return this._context;}
 
  public initialize(config: DataSourceConfig<TContext>): void {
    this._context = config.context;
  }
}


export class ApplicantDomainApi<TContext extends Context> extends DomainDataSource<TContext> {

  public async applicantUpdate(): Promise<void> {
    const userType = this.context.user?.userType || 'unknown';
    console.log(`applicantUpdate | main | ${userType}| ${JSON.stringify(this.context.user)} | ${JSON.stringify(this.context.aamcToken)}`);
    console.log(`applicantUpdate | user | ${userType}| ${JSON.stringify(this.context.user)}`);
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log(`applicantUpdate | token | ${userType}| ${JSON.stringify(this.context.aamcToken)}`);
  }
}


// older way of defining domain data sources - not good
export const DomainDataSources = {
  applicantDomainApi: new ApplicantDomainApi<Context>(),
};
// newer way of defining domain data sources - good
export function domainDataSources() {
  return {
    applicantDomainApi: new ApplicantDomainApi<Context>(),
  };
} 



// older way of defining data sources - not good
export const DataSources = {
  ...DomainDataSources
};
export type DataSourcesType = typeof DataSources;
// newer way of defining data sources - good
export function createDataSources() {
  return {
    // ...DomainDataSources // This shares instances across requests - not good
    ...domainDataSources()  // This creates new instances for each request - good
  };
}