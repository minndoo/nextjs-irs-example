import { Entry, ObjectReference } from "~/features/core/types";

export type Gallery = Entry & {
  [key: string]: any
  fields: {
    title: string;
    slug: string;
    author: ObjectReference;
    coverImage: ObjectReference;
    images: ObjectReference[];
    tags: string[];
    date: Date;
  }
}