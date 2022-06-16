import { Entry } from "~/features/core/types";

export type Author = Entry & {
  fields: {
    name?: string;
    twitterHandle?: string;
    profilePhoto?: string;
    biography?: string;
    createdEntries?: string;
  }
}