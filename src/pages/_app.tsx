import "semantic-ui-css/semantic.min.css";
import type { AppProps } from "next/app";
import { Layout } from "~/features/ui/Layout";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "~/features/core/api/graphql";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
