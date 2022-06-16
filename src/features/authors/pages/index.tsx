import { GetStaticProps, NextPage } from "next";

import { contentfulClient } from "~/features/core/api/contentful";
import { ContentEntries } from "~/features/core/types";
import { Author } from "../types";

export const AuthorsPage: NextPage<{
  authors: Author[];
}> = ({ authors }) => {
  return (
    <>
      <h1>Authors</h1>
      <ul>
        {authors.map((author) => {
          const { twitterHandle } = author.fields;
          return <li key={twitterHandle}>{twitterHandle}</li>;
        })}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const allAuthors = await contentfulClient.getEntries<ContentEntries<Author>>(
    "author"
  );

  return {
    props: {
      authors: allAuthors.items,
    },
  };
};
