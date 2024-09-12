import React from "react";
import styles from "./component.module.css";
import { MangaResponse } from "@/app/ts/interfaces/apiOMangaDataInterface";
import Link from "next/link";
import * as AddToFavourites from "@/app/components/Buttons/AddOToFavourites";
import FavouriteSvg from "@/public/assets/heart.svg";
import FavouriteFillSvg from "@/public/assets/heart-fill.svg";

export default function HeadingInfo({
  mangaInfo,
}: {
  readonly mangaInfo: Readonly<MangaResponse & { item: any }>;
}) {
  const item = mangaInfo.item;

  return (
    <section id={styles.media_title_container}>
      <small>{item.origin_name[0]}</small>
      <h1 id={styles.heading_title}>{item.name.toUpperCase()}</h1>
      <div
        id={styles.genres_and_type_container}
        className="display_flex_row align_items_center"
      >
        <div
          id={styles.genres_container}
          className="display_flex_row align_items_center"
        >
          {item.category.length > 0 && (
            <ul>
              {item.category.map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/ocategory/${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          )}

          <span style={{ color: "#356bae" }}>Manga</span>
        </div>
        <div id={styles.btns_actions_container}>
          <AddToFavourites.Button svgOnlyColor={"#356bae"} mediaInfo={item}>
            <AddToFavourites.SvgIcon>
              <FavouriteSvg fill="var(--white-100)" />
            </AddToFavourites.SvgIcon>

            <AddToFavourites.SvgIcon>
              <FavouriteFillSvg fill="var(--brand-color)" />
            </AddToFavourites.SvgIcon>
          </AddToFavourites.Button>
        </div>
      </div>
    </section>
  );
}
