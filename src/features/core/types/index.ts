export type ContentEntries<T> = {
  items: T[]
}

export type ObjectReference = {
  id: string;
  type: string;
  linkType: string;
}

export type Entry = {
  sys: {
    id: string
  }
}