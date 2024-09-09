"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import Link from "next/link";
import { MangaItem } from "@/app/ts/interfaces/apiOMangaDataInterface";
import omanga from "@/app/api/oManga";
import { AnimatePresence, motion } from "framer-motion";
import BookSvg from "@/public/assets/book.svg";
import PaginationButtons from "@/app/omanga/[slug]/components/PaginationButtons";

const framerMotionLoadingChapters = {
  initial: {
    opacity: 0.5,
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
    opacity: 0,
  },
};

const framerMotionShowUpChapters = {
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
};

function MangaChaptersContainer({ manga }: { manga: MangaItem }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currMangasList, setCurrMangasList] = useState<any[]>([]);
  const [totalNumberPages, setTotalNumberPages] = useState<number>(0);
  const [currActivePage, setCurrActivePage] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);

  const rangeChaptersPerPage = 10;

  useEffect(() => {
    fetchMangaChapters();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + rangeChaptersPerPage;
    setCurrMangasList(chaptersList.slice(itemOffset, endOffset));
  }, [itemOffset, chaptersList]);

  async function fetchMangaChapters() {
    setIsLoading(true);
    try {
      const response = await omanga.getComicDetail(manga.slug);
      if (response && response.data) {
        const chapters = response.data.item.chapters[0].server_data || [];
        setChaptersList(chapters);
        setTotalNumberPages(Math.ceil(chapters.length / rangeChaptersPerPage));
        setCurrMangasList(chapters.slice(0, rangeChaptersPerPage));
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
    setIsLoading(false);
  }

  function handleButtonPageNavigation(event: { selected: number }) {
    setIsLoading(true);
    const newOffset =
      (event.selected * rangeChaptersPerPage) % chaptersList.length;
    setItemOffset(newOffset);
    setCurrActivePage(event.selected);
    setTimeout(() => setIsLoading(false), 400);
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
            currMangasList.map((chapter, key) => {
              // check duplicate chapter name
              if (
                chapter.chapter_name === currMangasList[key - 1]?.chapter_name
              ) {
                return null;
              }
              return (
                <motion.li
                  key={key}
                  title={`Chapter ${chapter.chapter_name} - ${manga.name}`}
                  variants={framerMotionShowUpChapters}
                  className={styles.chapter_container}
                >
                  <div className={styles.icon_container}>
                    <BookSvg alt="Book Opened Icon" width={16} heighy={16} />
                  </div>
                  <Link
                    href={`/oread/${chapter.chapter_api_data
                      .split("/")
                      .pop()}?slug=${manga.slug}`}
                  >
                    <div className={styles.info_container}>
                      <h3>{`Chapter ${chapter.chapter_name}: ${
                        chapter.chapter_title !== ""
                          ? chapter.chapter_title
                          : manga.name
                      }`}</h3>
                    </div>
                  </Link>
                </motion.li>
              );
            })}

          {!isLoading && currMangasList.length === 0 && (
            <span>No chapters available.</span>
          )}
        </motion.ol>
      </AnimatePresence>

      {totalNumberPages > 1 && (
        <nav id={styles.pagination_buttons_container}>
          <PaginationButtons
            onPageChange={handleButtonPageNavigation}
            pageCount={totalNumberPages}
            redirectToPage={currActivePage}
          />
        </nav>
      )}
    </div>
  );
}

export default MangaChaptersContainer;
