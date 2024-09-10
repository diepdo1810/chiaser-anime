"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg";
import FavouriteSvg from "@/public/assets/heart.svg";
import FavouriteFillSvg from "@/public/assets/heart-fill.svg";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { updateUserFavouriteMedias } from "@/app/lib/user/userDocUpdateOptions";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";
import { MangaItem } from "@/app/ts/interfaces/apiOMangaDataInterface"; // Import MangaItem interface

export function Button({
  mediaInfo, // Now uses MangaItem
  children,
  svgOnlyColor,
  isActiveOnAnilist,
  customText,
}: {
  mediaInfo: MangaItem; // Change type to MangaItem
  children?: React.ReactNode[];
  svgOnlyColor?: string;
  isActiveOnAnilist?: boolean;
  customText?: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wasAddedToFavourites, setWasAddedToFavourites] = useState<boolean>(
    isActiveOnAnilist || false
  );

  const anilistUser = useAppSelector((state) => state.UserInfo.value);
  const dispatch = useAppDispatch();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (!loading) {
      isMediaOnUserDoc();
    }
  }, [user, anilistUser, loading]);

  // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
  async function handleMediaOnFavourites() {
    // Opens Login Modal
    if (!user && !anilistUser) return dispatch(toggleShowLoginModalValue());

    setIsLoading(true);
    console.log(mediaInfo);
    const favouriteMediaData = {
      id: mediaInfo.slug,
      title: {
        romaji: mediaInfo.name,
      },
      format: "MANGA",
      description: mediaInfo.name,
      coverImage: {
        extraLarge: mediaInfo.thumb_url,
        large: mediaInfo.thumb_url,
      },
    };

    await updateUserFavouriteMedias({
      userId: user?.uid || `${anilistUser?.id}`,
      mediaData: favouriteMediaData,
      isAddAction: !wasAddedToFavourites,
    });

    wasAddedToFavourites
      ? setWasAddedToFavourites(false)
      : setWasAddedToFavourites(true);

    setIsLoading(false);
  }

  // IF MEDIA ID MATCHES ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
  async function isMediaOnUserDoc() {
    if (!user && !anilistUser) return;

    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const wasMediaIdFoundOnDoc = userDoc
      .get("bookmarks")
      ?.find((item: { id: string }) => item.id === mediaInfo._id);

    if (wasMediaIdFoundOnDoc) setWasAddedToFavourites(true);
  }

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      id={styles.container}
      className={children ? styles.custom_text : ""}
      onClick={() => handleMediaOnFavourites()}
      disabled={isLoading}
      data-added={wasAddedToFavourites}
      data-unique-color={svgOnlyColor != undefined}
      aria-label={
        wasAddedToFavourites
          ? "Click To Remove from Favourites"
          : "Click To Add To Favourites"
      }
      title={
        wasAddedToFavourites
          ? `Remove ${mediaInfo.name} from Favourites`
          : `Add ${mediaInfo.name} To Favourites`
      }
    >
      {isLoading && <LoadingSvg alt="Loading Icon" width={16} height={16} />}

      {!isLoading &&
        wasAddedToFavourites &&
        (children ? (
          children[1]
        ) : (
          <>
            <FavouriteFillSvg
              width={16}
              height={16}
              fill={svgOnlyColor || "var(--brand-color)"}
            />{" "}
            FAVOURITED
          </>
        ))}

      {!isLoading &&
        !wasAddedToFavourites &&
        (children ? (
          children[0]
        ) : (
          <>
            <FavouriteSvg
              width={16}
              height={16}
              fill={svgOnlyColor || "var(--white-100)"}
            />{" "}
            FAVOURITE
          </>
        ))}

      {customText || ""}
    </motion.button>
  );
}

export function SvgIcon({ children }: { children: React.ReactNode }) {
  return children;
}
