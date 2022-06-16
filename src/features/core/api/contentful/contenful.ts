import { ContenfulClientProps } from './types';

// !!! TODO: use graphql instead -> this is madness
interface IContentfulClient {
  accessToken: string | undefined;
  space: string | undefined;
  environment: string | undefined;
  baseUrl: string;

  getEntries<T>(typeId: string):Promise<T>
  getEntry<T>(entryId: string):Promise<T>
}

class ContentfulClient implements IContentfulClient {
  accessToken: string | undefined;
  space: string | undefined;
  environment: string | undefined;
  baseUrl: string;

  constructor ({accesToken, space, environment}: ContenfulClientProps) {
    this.accessToken = accesToken;
    this.space = space;
    this.environment = environment || 'master';
    this.baseUrl = 'https://cdn.contentful.com';
  }

  private createEndpointUrl (endpoint: string, searchQueries?: {[key:string]: any}): string {
    //create base
    const urlObj = new URL(`${this.baseUrl}/spaces/${this.space}/environments/${this.environment}${endpoint}`);
    urlObj.searchParams.set('access_token', this.accessToken || '');
    searchQueries && Object.entries(searchQueries).forEach(([key, value]) => urlObj.searchParams.set(key, value));

    return urlObj.toString();
  }
  
  getEntries<T>(typeId: string, options?: Omit<{[key:string]: any}, 'content_type'>): Promise<T> {
    const entriesUrl = this.createEndpointUrl('/entries', {'content_type': typeId, ...options});

    return fetch(entriesUrl).then(data => {
      return data.json() as Promise<T>;
    }).catch(error => error);
  };

  getEntry<T>(entryId: string, options?: {[key:string]: any}): Promise<T> {
    const entryUrl = this.createEndpointUrl(`/entries/${entryId}`, options);

    return fetch(entryUrl).then(data => {
      return data.json() as Promise<T>
    }).catch(error => error);
  }

}

class Contentful {
  static createClient(params: ContenfulClientProps) {
    return new ContentfulClient(params)
  }
}

export default Contentful;