import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useCallback, useMemo, useState } from "react";
import { Input } from "semantic-ui-react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { contentfulClient } from "~/features/core/api/contentful";
import { Asset, ContentEntries } from "~/features/core/types";
import { Gallery } from "~/features/galleries/types";

import ReactPhotoGallery, { Photo, PhotoProps } from "react-photo-album";

type Params = {
  slug: string;
};

const transformImageAssets = (assets: Asset[]) => {
  return assets.map((image) => ({
    src: `https:${image.fields.file.url}`,
    height: image.fields.file.details.image.height,
    width: image.fields.file.details.image.width,
    alt: image.fields.file.title,
  }));
};

export const GalleryDetailPage: NextPage<{
  gallery: Gallery;
  assets: Asset[];
}> = ({ gallery, assets }) => {
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const photos = useMemo(() => transformImageAssets(assets), [assets]);
  const imageRenderer = useCallback(({ photo, layoutOptions }: PhotoProps) => {
    const { width, height, src, alt, key } = photo;
    const { spacing } = layoutOptions;

    return (
      <span key={key} style={{ margin: `${spacing}px`, lineHeight: 0 }}>
        <Image src={src} height={height} width={width} alt={alt} />
      </span>
    );
  }, []);

  return (
    <>
      <h1>{gallery.fields.title}</h1>
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
  const allGalleries = await contentfulClient.getEntries<
    ContentEntries<Gallery>
  >("photoGallery");

  const allGalleriesPaths = allGalleries.items.map((gallery) => ({
    params: {
      slug: gallery.fields.slug,
    },
  }));

  return {
    paths: allGalleriesPaths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<any, Params> = async (context) => {
  let galleryEntries = {} as ContentEntries<Gallery>;

  try {
    galleryEntries = (await contentfulClient.getEntries<
      ContentEntries<Gallery>
    >("photoGallery" || "", {
      include: 1,
      "fields.slug": context.params?.slug || "",
    })) as ContentEntries<Gallery>;
  } catch {
    console.error("Issue with getting detail gallery entry.");
  }

  return {
    props: {
      gallery: galleryEntries.items[0],
      assets: galleryEntries.includes.Asset,
    },
    revalidate: 180,
  };
};
