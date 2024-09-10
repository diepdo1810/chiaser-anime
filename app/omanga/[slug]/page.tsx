// page.tsx

import React from "react";
import omanga from "@/app/api/oManga";
import styles from "./page.module.css";
import Image from "next/image";
import { MangaResponse } from "@/app/ts/interfaces/apiOMangaDataInterface";
import parse from "html-react-parser";
import PageHeading from "./components/PageHeading";
import MangaChaptersContainer from "./components/MangaChaptersContainer";
import RecomendManga from "./components/RecomendManga";
import CommentsOSection from "@/app/components/CommentsOSection";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data } = (await omanga.getComicDetail(params.slug)) as MangaResponse;

  return {
    title: `${data.item.name} | MangaProject`,
    description:
      data.seoOnPage.descriptionHead || `See more info about ${data.item.name}`,
  };
}

export default async function MangaPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data } = (await omanga.getComicDetail(params.slug)) as MangaResponse;

  if (!data) {
    return <div>Error loading manga details.</div>;
  }

  const manga = data.item;

  function bcgImgBasedOnScreenDisplay() {
    return `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${omanga.getImageUrl(
      manga.thumb_url
    )})`;
  }

  return (
    <main id={styles.container}>
      {/* BANNER or BACKGROUND COLOR*/}
      <div
        id={styles.banner_background_container}
        style={{ background: bcgImgBasedOnScreenDisplay() }}
      ></div>

      <div id={styles.manga_info_container}>
        <PageHeading mangaInfo={data} />

        <section id={styles.info_container}>
          <div id={styles.description_episodes_related_container}>
            {/* DESCRIPTION */}
            <section id={styles.description_container}>
              <h2 className={styles.heading_style}>DESCRIPTION</h2>

              {manga.content && (
                <span>{parse(manga.content) || "Not Available"}</span>
              )}
            </section>

            {/* CHAPTERS - ONLY FOR MANGAS */}
            <section>
              <h2 className={styles.heading_style}>CHAPTERS</h2>
              <MangaChaptersContainer manga={manga} />
            </section>

            {/* RECOMMENDATIONS ACCORDING TO THIS MEDIA */}
            <RecomendManga manga={manga} styles={styles} />
          </div>

          <div id={styles.hype_container}>
            {/* THUMB */}
            {manga.thumb_url && (
              <div id={styles.yt_video_container}>
                <h2 className={styles.heading_style}>THUMBNAIL PHOTO</h2>
                <Image
                  src={omanga.getImageUrl(manga.thumb_url)}
                  alt={manga.name}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* COMMENTS SECTION */}
          <section id={styles.comments_container}>
            <h2 className={styles.heading_style}>COMMENTS</h2>

            <CommentsOSection
              mangaInfo={manga}
              mangaSlug={params.slug}
            />
          </section>
        </section>
      </div>
    </main>
  );
}
