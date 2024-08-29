"use client"

import React, { useEffect, useState } from "react";
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import omanga from "@/app/api/oManga";
import { MangaItem } from "@/app/ts/interfaces/apiOMangaDataInterface";

const MangaRecommendations = ({ manga, styles }: { manga: MangaItem; styles: any }) => {
    const [recommendations, setRecommendations] = useState<MangaItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      fetchRecommendations();
    }, []);
  
    async function fetchRecommendations() {
      setIsLoading(true);
      try {
        const response = await omanga.getComicsByCategory({ slug: manga.category[0].slug });
  
        if (response && response.data.items) {
          const randomRecommendations = response.data.items.sort(() => 0.5 - Math.random()).slice(0, 12);
          // check duplicates
          const filteredRecommendations = randomRecommendations.filter((media) => media._id !== manga._id);

          setRecommendations(filteredRecommendations);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
      setIsLoading(false);
    }

    return (
      <>
        {recommendations.length > 0 && (
          <section id={styles.similar_container}>
            <h2 className={styles.heading_style}>
              SIMILAR MANGAS YOU MAY LIKE
            </h2>
            <ul>
              {recommendations.map((media, key) => (
                <li key={key}>
                  <MediaCard.Container positionIndex={key + 1} onDarkMode>
                    <MediaCard.MediaImgLinkOmanga
                        hideOptionsButton={false}
                        mediaInfo={media as any}
                        title={media.name}
                        formatOrType="MANGA"
                        url={omanga.getImageUrl(media.thumb_url)}
                        mediaId={media.slug}
                    />
                    <MediaCard.SmallTag
                      seasonYear={new Date(media.updatedAt).getFullYear()}
                      tags={media.category[0]?.name || "Manga"}
                    />
                    <MediaCard.LinkTitle title={media.name} id={Number(media._id)} />
                  </MediaCard.Container>
                </li>
              ))}
            </ul>
          </section>
        )}
      </>
    );
  };
  
  export default MangaRecommendations;
  