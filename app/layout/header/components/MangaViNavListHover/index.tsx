"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import omanga from "@/app/api/oManga";
import Link from "next/link";
import ErrorPlaceholder from "../ErrorPlaceholder";
import {
  MangaGenreResponse,
  MangaItem,
} from "@/app/ts/interfaces/apiOMangaDataInterface";
import * as MediaInfoExpanded from "@/app/components/MediaCards/MediaInfoExpandedWithCoverVi";
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg";

const chunkArray = (array: MangaGenreResponse[], size: number) => {
  const result: MangaGenreResponse[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
};

function CategoryNavList() {
  const [categories, setCategories] = useState<MangaGenreResponse[] | null>([]);
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [error, setError] = useState(false);
  const chunkSize = 10;

  useEffect(() => {
    fetchCategories();
    fetchTrendingMangasList();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = (await omanga.getCategories()) as MangaGenreResponse[];
      setCategories(data?.data.items);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const fetchTrendingMangasList = async () => {
    try {
      const trendingMangas = (await omanga.getComicsByType({
        type: "truyen-moi",
        page: 1,
      })) as MangaItem[];
      setMangaList(trendingMangas?.data.items);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  if (error) {
    return <ErrorPlaceholder />;
  }

  if (categories.length === 0) {
    return <ErrorPlaceholder />;
  }

  const chunks = chunkArray(categories, chunkSize);

  return (
    <ul id={styles.manga_header_nav_container}>
      <div style={{ display: "flex" }}>
        <div id={styles.manga_card_container}>
          <h5>Manga of the Day</h5>

          {mangaList.length > 0 ? (
            <MediaInfoExpanded.Container mediaInfo={mangaList[0]}>
              <MediaInfoExpanded.Description
                description={mangaList[0].status}
              />

              <MediaInfoExpanded.Buttons mediaInfo={mangaList[0]} />
            </MediaInfoExpanded.Container>
          ) : (
            <LoadingSvg />
          )}
        </div>
        <div id={styles.topics_container}>
          {chunks.map((chunk, index) => (
            <li key={index}>
              <div id={styles.topics_container}>
                <ul>
                  {chunk.map((category) => (
                    <li key={category._id}>
                      <Link href={`/ocategory/${category.slug}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </div>
      </div>
    </ul>
  );
}

export default CategoryNavList;
