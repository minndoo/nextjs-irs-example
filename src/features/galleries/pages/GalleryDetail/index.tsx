import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useCallback, useMemo, useState } from "react";
import { Input } from "semantic-ui-react";
import ReactPhotoGallery, { Photo, PhotoProps } from "react-photo-album";
import NextImage from "next/image";

import { initializeApollo } from "~/features/core/api/graphql";
import {
  GetAllPhotoGalleriesDocument,
  GetAllPhotoGalleriesQuery,
  GetAllPhotoGalleriesQueryVariables,
  GetAllPhotosFromGalleryDocument,
  GetAllPhotosFromGalleryQuery,
  GetAllPhotosFromGalleryQueryVariables,
  Image,
  Maybe,
  PhotoGallery,
} from "~/generated/graphql";

type Params = {
  slug: string;
};

const transformImageAssets = (assets: Maybe<Image>[]): Photo[] => {
  return assets.map((image) => ({
    src: image?.photo?.url || "",
    height: image?.photo?.height || 0,
    width: image?.photo?.width || 0,
    alt: image?.photo?.description || "",
  }));
};

export const GalleryDetailPage: NextPage<{
  galleryBySlug: PhotoGallery;
}> = ({ galleryBySlug }) => {
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const photos = useMemo(
    () => transformImageAssets(galleryBySlug.imagesCollection?.items ?? []),
    [galleryBySlug]
  );
  const imageRenderer = useCallback(({ photo, layoutOptions }: PhotoProps) => {
    const { width, height, src, alt, key } = photo;
    const { spacing } = layoutOptions;

    return (
      <span key={key} style={{ margin: `${spacing}px`, lineHeight: 0 }}>
        <NextImage src={src} height={height} width={width} alt={alt} />
      </span>
    );
  }, []);

  return (
    <>
      <h1>{galleryBySlug.title}</h1>
      <div style={{ marginBottom: "10px" }}>
        <Input
          type="number"
          onChange={(event) => {
            setNumberOfColumns(parseInt(event.target.value) || 5);
          }}
          value={numberOfColumns}
          pattern="[0-9]+"
        />
      </div>
      <div style={{ margin: "auto" }}>
        <ReactPhotoGallery
          layout="columns"
          columns={numberOfColumns}
          photos={photos}
          renderPhoto={imageRenderer}
          spacing={0.5}
        />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
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

  const allSlugs =
    allGalleries.data?.photoGalleryCollection?.items.map((photoGallery) => ({
      params: {
        slug: photoGallery?.slug ?? "",
      },
    })) ?? [];

  return {
    paths: allSlugs,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<any, Params> = async (context) => {
  const apolloClient = initializeApollo();

  const galleryBySlug = await apolloClient.query<
    GetAllPhotosFromGalleryQuery,
    GetAllPhotosFromGalleryQueryVariables
  >({
    query: GetAllPhotosFromGalleryDocument,
    variables: {
      where: { slug: context.params?.slug ?? "" },
    },
  });

  return {
    props: {
      galleryBySlug: galleryBySlug.data?.photoGalleryCollection?.items[0],
    },
    revalidate: 180,
  };
};
