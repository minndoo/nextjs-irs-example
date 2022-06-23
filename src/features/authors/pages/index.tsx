import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import { initializeApollo } from "~/features/core/api/graphql";
import {
  Author,
  GetAllAuthorsDocument,
  GetAllAuthorsQuery,
} from "~/generated/graphql";

export const AuthorsPage: NextPage<{
  authors?: Author[];
}> = ({ authors }) => {
  return (
    <>
      <h1>Authors</h1>
      <ul>
        {authors?.map((author) => {
          const { twitterHandle = "" } = author;
          return <li key={twitterHandle}>{twitterHandle}</li>;
        })}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const allAuthors = await apolloClient.query<GetAllAuthorsQuery>({
    query: GetAllAuthorsDocument,
  });

  return {
    props: { authors: allAuthors.data?.authorCollection?.items },
  };
};
