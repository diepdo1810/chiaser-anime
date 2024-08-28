"use client";

import React, { useEffect, useState } from 'react';
import omanga from '@/app/api/oManga'; // Update with correct path
import { MangaCategoryResponse } from '@/app/ts/interfaces/apiOMangaDatainterface'; // Update with correct path
import styles from './component.module.css'; 
import { motion, AnimatePresence } from 'framer-motion';
import * as MediaCard from '@/app/components/MediaCards/MediaCard'

interface MangaListProps {
  slug: string;
  page?: number;
}

const framerMotionShowUp = {

    hidden: {
        opacity: 0,
        scale: 1.08
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.5
        }
    }

}

const MangaList: React.FC<MangaListProps> = ({ slug, page = 1 }) => {
  const [comics, setComics] = useState<MangaCategoryResponse['data']['items'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalLength, setTotalLength] = useState(0);
  const [currPageNumber, setCurrPageNumber] = useState(page);

  useEffect(() => {
    const fetchComics = async () => {
      setLoading(true);
      try {
        const response = await omanga.getComicsByCategory({ slug, page });
        if (response && response.data) {
            setComics(response.data.items);
            setTotalLength(response.data.params.pagination.totalItems);
        } else {
          setError('No comics found.');
        }
      } catch (err) {
        setError('An error occurred while fetching comics.');
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [slug, currPageNumber]);

  const fetchNextResultPage = async () => {
    setCurrPageNumber(currPageNumber + 1);

    try {
        setLoading(true);
        const response = await omanga.getComicsByCategory({ slug, page: currPageNumber + 1 });
        if (response && response.data) {
            setComics((prevComics) => [...(prevComics || []), ...response.data.items]);
        } else {
          setError('No more comics found.');
        }
      } catch (err) {
        setError('An error occurred while fetching more comics.');
      } finally {
        setLoading(false);
      }
  };


  if (loading  && currPageNumber === 1) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id={styles.content_container}>
        <div id={styles.heading_container}>
        </div>

        {comics && comics.length === 0 && (
        <div id={styles.error_text}>
            <h2>No Results Found</h2>
        </div>
        )}

        {comics && comics.length > 0 && (
        <div>
            <AnimatePresence initial={true} mode="wait">
                <motion.ul id={styles.results_container} initial="hidden" animate="visible" variants={framerMotionShowUp}>
                    {comics.map((comic, key) => (
                    <motion.li key={key} variants={framerMotionShowUp}>
                        <MediaCard.Container onDarkMode>
                            <MediaCard.MediaImgLinkOmanga
                                hideOptionsButton={false}
                                mediaInfo={comic as any}
                                title={comic.name}
                                formatOrType="MANGA"
                                url={omanga.getImageUrl(comic.thumb_url)}
                                mediaId={''}
                            />

                            <MediaCard.SmallTag
                                seasonYear={2021}
                                tags={comic.category[0].name}
                            />

                            <MediaCard.LinkTitleOmanga
                                title={comic.name}
                            />

                        </MediaCard.Container>
                    </motion.li>
                    ))}
                </motion.ul>
            </AnimatePresence>
        </div>
        )}




        {comics && totalLength > comics.length * currPageNumber && (
        <button
            onClick={() => fetchNextResultPage()}
            aria-label={loading ? 'Loading' : 'View More Results'}
        >
            {loading ? 'Loading...' : ' + View more'}
        </button>
        )}

        <span style={{fontSize: 'var(--font-size--small-2)' }}>
            Last Update: {new Date().toLocaleDateString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>

        {comics && comics.length > 0 && (
        <span>
            Showing {(totalLength <= comics.length * currPageNumber) ? 'all ' : `${comics.length * currPageNumber} out of `}
            <span>{totalLength.toLocaleString('en-US')}</span> results
        </span>
        )}
  </div>

  );
};

export default MangaList;
