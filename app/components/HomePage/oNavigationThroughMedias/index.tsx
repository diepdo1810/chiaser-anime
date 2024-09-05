"use client";
import React, { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import SwiperCarousel from "./swiperCarousel";
import oManga from "@/app/api/oManga";
import styles from "./component.module.css";
import { MangaItem } from "@/app/ts/interfaces/apiOMangaDataInterface";
import * as MediaCard from "../../MediaCards/MediaCard";
import * as MediaCardClientSide from "../../MediaCards/MediaCard/variantClientSide";
import { Url } from "next/dist/shared/lib/router/router";
import CloseSvg from "@/public/assets/x.svg";
import Image from "next/image";
import Link from "next/link";
import * as AddToFavourites from "../../Buttons/AddToFavourites";

interface BestRatedMangasProps {
  headingTitle: string;
  route: Url;
  sortBy: "RELEASE" | "FAVOURITES_DESC" | "UPDATED_AT_DESC";
  mediaFormat?: "ANIME" | "MANGA";
  isFetchByDateButtonsOnScreen?: boolean;
  onDarkBackground?: boolean;
  isLayoutInverted?: boolean;
  isResultsSortedByTrending?: boolean;
}

const framerMotionPopUpMedia = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const BestRatedMangas: React.FC<BestRatedMangasProps> = ({
  onDarkBackground,
  isLayoutInverted,
}) => {
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mediaSelected, setMediaSelected] = useState<MangaItem | null>(null);
  const [isTrailerBeeingShown, setIsTrailerBeeingShown] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchMangas() {
      const result = await oManga.getComicsByType({
        type: "truyen-moi",
        page: 1,
      });
      console.log(result.data.items);
      setMangaList(result.data.items);
    }

    fetchMangas();
  }, []);

  function handleMediaPopUpFocus(media: string | null) {
    console.log(media);
    if (media) {
      setSelectedId(media);
      setMediaSelected(
        mangaList.find((item) => item._id === media) as MangaItem | null
      );
      setIsTrailerBeeingShown(true);
    } else {
      setSelectedId(null);
      setIsTrailerBeeingShown(false);
      setMediaSelected(null);
    }
  }

  return (
    <motion.div
      id={styles.itens_container}
      data-darkBackground={onDarkBackground}
      data-layoutInverted={isLayoutInverted}
      variants={framerMotionPopUpMedia}
      initial="initial"
      animate="animate"
    >
      <SwiperCarousel title="Best Rated Mangas" daysSelected={0}>
        {mangaList.length > 0 ? (
          mangaList.map((manga) => (
            <SwiperSlide key={manga._id}>
              <MediaCardClientSide.FramerMotionContainer
                positionIndex={mangaList.indexOf(manga) + 1}
                isLoading={false}
                framerMotionProps={{
                  layoutId: String(manga._id),
                  mediaId: Number(manga._id),
                  framerMotionExpandCardFunction: () =>
                    handleMediaPopUpFocus(manga._id),
                }}
              >
                <MediaCard.MediaImg
                  hideOptionsButton={false}
                  mediaInfo={manga as any}
                  title={manga.name}
                  formatOrType={manga.category[0]?.name || ""}
                  url={oManga.getImageUrl(manga.thumb_url)}
                />

                <MediaCard.SmallTag
                  seasonYear={new Date(manga.updatedAt).getFullYear()}
                  tags={manga.category[0]?.name || ""}
                />

                <MediaCard.Title title={manga.name} />
              </MediaCardClientSide.FramerMotionContainer>
            </SwiperSlide>
          ))
        ) : (
          <p>No mangas found</p>
        )}
      </SwiperCarousel>
      <AnimatePresence>
        {selectedId && mediaSelected && (
          <motion.div
            id={styles.overlay}
            onClick={() => handleMediaPopUpFocus(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={String(selectedId)}
              id={styles.expand_container}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: mediaSelected.thumb_url
                  ? `linear-gradient(to bottom right, rgba(0, 0, 0, 0.95) 25%, rgba(0, 0, 0, 0.75) ), url(${oManga.getImageUrl(
                      mediaSelected.thumb_url
                    )})`
                  : `var(--black-100)`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <motion.button
                onClick={() => handleMediaPopUpFocus(null)}
                title="Close"
              >
                <CloseSvg width={16} height={16} />
              </motion.button>

              <motion.div className={styles.media_container}>
                <motion.div className={styles.img_container}>
                  <Image
                    src={`${oManga.getImageUrl(mediaSelected.thumb_url)}`}
                    alt={mediaSelected.name}
                    fill
                    sizes="(max-width: 430px) 45vw, (max-width: 620px) 33vw, (max-width: 876px) 15vw, 10vw"
                  />
                </motion.div>

                <motion.div className={styles.info_container}>
                  <motion.h5>{mediaSelected.name}</motion.h5>

                  {mediaSelected.category && (
                    <motion.p>
                      {mediaSelected.category.map(
                        (item, key) =>
                          `${item.name}${
                            key + 1 == mediaSelected.category.length ? "" : ", "
                          }`
                      )}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div className={styles.description_container}>
                <motion.p>{mediaSelected.status}</motion.p>
              </motion.div>

              <motion.div className={styles.btns_container}>
                <motion.div className={`${styles.action_btns_container}`}>
                  <Link href={`/media/${mediaSelected._id}`}>SEE MORE</Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BestRatedMangas;
