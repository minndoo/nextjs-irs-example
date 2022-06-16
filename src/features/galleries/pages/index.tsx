import { NextPage, GetStaticProps } from "next";
import Link from "next/link";
import { contentfulClient } from "~/features/core/api/contentful";
import { ContentEntries } from "~/features/core/types";
import { Gallery } from "../types";

export const GalleriesPage: NextPage<{ galleries: Gallery[] }> = ({
  galleries,
}) => {
  return (
    <>
      <h1>Galleries page</h1>
      <ul>
        {galleries?.length &&
          galleries.map((gallery) => {
            const { fields, sys } = gallery;
            return (
              <Link
                href={`/galleries/${sys.id}`}
                key={fields.slug || fields.title}
              >
                {fields.title}
              </Link>
            );
          })}
      </ul>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const galleries = await contentfulClient.getEntries<ContentEntries<Gallery>>(
    "photoGallery"
  );

  return {
    props: {
      galleries: galleries.items || [],
    },
    // set to 3 minutes, we don't have to revalidate this page as often
    revalidate: 180,
  };
};
