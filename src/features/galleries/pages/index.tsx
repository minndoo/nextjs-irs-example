import { NextPage, GetStaticProps } from "next";
import Link from "next/link";
import { initializeApollo } from "~/features/core/api/graphql";
import {
  GetAllPhotoGalleriesDocument,
  GetAllPhotoGalleriesQuery,
  GetAllPhotoGalleriesQueryVariables,
  PhotoGallery,
} from "~/generated/graphql";

export const GalleriesPage: NextPage<{ galleries: PhotoGallery[] }> = ({
  galleries,
}) => {
  return (
    <>
      <h1>Galleries page</h1>
      <ul>
        {galleries?.length &&
          galleries.map((gallery) => {
            const { title = "", slug = "" } = gallery;
            return (
              <li key={slug}>
                <Link href={`/galleries/${slug}`}>{title}</Link>
              </li>
            );
          })}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const allGalleries = await apolloClient.query<
    GetAllPhotoGalleriesQuery,
    GetAllPhotoGalleriesQueryVariables
  >({
    query: GetAllPhotoGalleriesDocument,
    variables: {
      limit: 0,
    },
  });

  return {
    props: {
      galleries: allGalleries.data?.photoGalleryCollection?.items,
    },
    // set to 3 minutes, we don't have to revalidate this page as often
    revalidate: 180,
  };
};
