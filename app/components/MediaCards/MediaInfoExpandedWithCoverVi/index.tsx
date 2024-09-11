import React from "react";
import styles from "./component.module.css";
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
import { MangaItem } from "@/app/ts/interfaces/apiOMangaDataInterface";
import { getMediaReleaseDate } from "@/app/lib/formatDateUnix";
import omanga from "@/app/api/oManga";

export function Container({
  children,
  mediaInfo,
  customDescription,
}: Readonly<{
  children: React.ReactNode;
  mediaInfo: MangaItem;
  customDescription?: string;
}>) {
  return (
    <div className={`${styles.midia_item_container}`}>
      {mediaInfo && (
        <>
          <Link id={styles.img_container} href={`/omanga/${mediaInfo.slug}`}>
            <Image
              src={omanga.getImageUrl(mediaInfo.thumb_url)}
              alt={`Cover Art for ${mediaInfo.name}`}
              fill
              sizes="(max-width: 580px) 25vw, (max-width: 820px) 15vw, 220px"
            ></Image>
          </Link>

          <div
            className={`${styles.item_info_container} ${
              customDescription ? styles.watch_page_custom_margin : ""
            }`}
          >
            {mediaInfo.updatedAt && (
              <small>
                {getMediaReleaseDate(
                  mediaInfo.updatedAt
                    ? {
                        month: new Date(mediaInfo.updatedAt).getMonth() + 1,
                        day: new Date(mediaInfo.updatedAt).getDate(),
                        year: new Date(mediaInfo.updatedAt).getFullYear(),
                      }
                    : undefined
                ) || "Not Available"}
              </small>
            )}

            <h4>
              <Link href={`/omanga/${mediaInfo.slug}`}>{mediaInfo.name}</Link>
            </h4>

            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function Description({ description }: { readonly description: string }) {
  return (
    <p>{description ? parse(description) : "Description Not Available"}</p>
  );
}

export function Buttons({ mediaInfo }: { readonly mediaInfo: MangaItem }) {
  return (
    <div className={styles.buttons_container}>
      {mediaInfo.chaptersLatest?.[0] && (
        <Link
          href={`/oread/${mediaInfo.chaptersLatest[0].chapter_api_data
            .split("/")
            .pop()}?slug=${mediaInfo.slug}`}
        >
          READ NOW
        </Link>
      )}
    </div>
  );
}
