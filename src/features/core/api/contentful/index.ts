import { CONTENTFUL_API_KEY, CONTENTFUL_SPACE_ID } from '~/lib/constants';

import Contentful from './contenful';

export const contentfulClient = Contentful.createClient({
  accesToken: CONTENTFUL_API_KEY,
  space: CONTENTFUL_SPACE_ID
});