export type Asset = {
  sys: {
    id: string
  }
  fields: {
    title: string
    file: {
      title: string
      url: string
      details: {
        image: {
          width: number
          height: number
        }
      }
    }
  }
}

export type ContentEntries<T> = {
  items: T[]
  includes: {
    Asset: Asset[]
  }
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