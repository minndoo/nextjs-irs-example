import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { contentfulClient } from "~/features/core/api/contentful";
import { ContentEntries } from "~/features/core/types";
import { Gallery } from "~/features/galleries/types";

type Params = {
  id: string;
};

export const GalleryDetailPage: NextPage<{ gallery: Gallery }> = ({
  gallery,
}) => {
  return <h1>{gallery.fields.title}</h1>;
};

export const getStaticPaths: GetStaticPaths<Params> = async (context) => {
  const allGalleries = await contentfulClient.getEntries<
    ContentEntries<Gallery>
  >("photoGallery");

  const allGalleriesPaths = allGalleries.items.map((gallery) => ({
    params: {
      id: gallery.sys.id,
    },
  }));

  return {
    paths: allGalleriesPaths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<any, Params> = async (context) => {
  let galleryEntry = {};
  try {
    galleryEntry = await contentfulClient.getEntry<Gallery>(
      context.params?.id || ""
    );
  } catch {
    console.error("Issue with getting detail gallery entry.");
  }

  return {
    props: {
      gallery: galleryEntry,
    },
  };
};
