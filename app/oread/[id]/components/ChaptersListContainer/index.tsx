"use client";
import React, { useEffect } from "react";
import styles from "./component.module.css";
import { MangaChapters } from "@/app/ts/interfaces/apiMangadexDataInterface";
import Link from "next/link";
import { motion } from "framer-motion";
import MarkChapterAsReadButton from "@/app/components/Buttons/MarkChapterAsRead";

type ComponentTypes = {
  mangaSlug: string;
  currChapterId: string;
  chaptersList: MangaChapters[];
};

function ChaptersListContainer({
  mangaSlug,
  currChapterId,
  chaptersList,
}: ComponentTypes) {
  useEffect(() => {
    function centerActiveListItemEpisode() {
      const elementActive = document.querySelector("li[data-active=true]");
      elementActive?.scrollIntoView();
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    setTimeout(centerActiveListItemEpisode, 2000);
  }, [currChapterId]);
  console.log(chaptersList);
  return (
    <div id={styles.chapters_list_container}>
      <div className={styles.heading_container}>
        <h3>CHAPTERS</h3>
      </div>

      <motion.ol id={styles.list_container}>
        {chaptersList.server_data.map((chapter: MangaChapters, key: number) => {
          // check duplicate chapter name
          if (chapter.chapter_name === chaptersList.server_data[key - 1]?.chapter_name) {
            return null;
          }
          return (
            <motion.li
              title={`Chapter ${chapter.chapter_name} - ${chapter.chapter_title}`}
              key={key}
              data-active={
                chapter.chapter_api_data.split("/").pop() === currChapterId
              }
            >
              <Link
                href={`/oread/${chapter.chapter_api_data
                  .split("/")
                  .pop()}?slug=${mangaSlug}`}
              >
                <div className={styles.img_container}>
                  <span>{chapter.chapter_name}</span>
                </div>
              </Link>

              <div className={styles.chapter_info_container}>
                <Link
                  href={`/oread/${chapter.chapter_api_data
                    .split("/")
                    .pop()}?slug=${mangaSlug}`}
                >
                  <h4>
                    {chapter.chapter_title != ""
                      ? chapter.chapter_title
                      : chapter.filename.replace(/\[.*\]/, '').trim()}
                  </h4>
                </Link>
                <MarkChapterAsReadButton
                  chapterNumber={Number(chapter.chapter_name)}
                  chapterTitle={chapter.chapter_title}
                  maxChaptersNumber={chaptersList.length}
                  showAdditionalText={true}
                  mediaId={chapter.chapter_api_data.split("/").pop()}
                />
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}

export default ChaptersListContainer;
