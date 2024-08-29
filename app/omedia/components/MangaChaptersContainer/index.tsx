"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import Link from "next/link";
import { MangaItem } from "@/app/ts/interfaces/apiOMangaDataInterface";
import omanga from "@/app/api/oManga";
import { AnimatePresence, motion } from "framer-motion";

const framerMotionLoadingChapters = {
    initial: {
      opacity: 0.5
    },
    animate: {
      opacity: 1,
      transition: {
        repeat: Infinity,
        duration: 1,
        repeatType: "loop" as const,
      },
    },
    exit: {
      opacity: 0
    },
  }
  
  const framerMotionShowUpChapters = {
    initial: {
      opacity: 0.5
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0,
      scale: 0
    }
  }

function MangaChaptersContainer({ manga }: { manga: MangaItem }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chaptersList, setChaptersList] = useState<any[]>([]);

  useEffect(() => {
    fetchMangaChapters();
  }, []);

  async function fetchMangaChapters() {
    setIsLoading(true);
    try {
      const response = await omanga.getComicDetail(manga.slug);
      if (response && response.data) {
        setChaptersList(response.data.item.chapters[0].server_data || []);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <AnimatePresence>
        <motion.ol id={styles.container} data-loading={isLoading}>
          {isLoading && (
            <motion.li
              id={styles.loading_chapters_container}
              variants={framerMotionLoadingChapters}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              Loading...
            </motion.li>
          )}

          {!isLoading &&
            chaptersList.map((chapter, key) => (
              <motion.li
                key={key}
                title={`Chapter ${chapter.chapter_name} - ${manga.name}`}
                variants={framerMotionShowUpChapters}
                className={styles.chapter_container}
              >
                <Link href={`/read/${manga.slug}/chapter/${chapter.chapter_name}`}>
                  <div className={styles.info_container}>
                    <h3>{`Chapter ${chapter.chapter_name}`}</h3>
                  </div>
                </Link>
              </motion.li>
            ))}

          {!isLoading && chaptersList.length === 0 && (
            <span>No chapters available.</span>
          )}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
}

export default MangaChaptersContainer;
