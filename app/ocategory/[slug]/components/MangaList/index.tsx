"use client";

import React, { use, useEffect, useState } from 'react';
import omanga from '@/app/api/oManga'; // Update with correct path
import { MangaCategoryResponse } from '@/app/ts/interfaces/apiOMangaDataInterface'; // Update with correct path
import styles from './component.module.css'; 
import { motion, AnimatePresence } from 'framer-motion';
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import BreadCrumb from '../BreadCrumb';

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
  const [comics, setComics] = useState<MangaCategoryResponse['data']['items']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalLength, setTotalLength] = useState(0);
  const [currPageNumber, setCurrPageNumber] = useState(page);
  const [showing, setShowing] = useState<string>('');
  const [items, setItems] = useState([]);
  const defaultComics = '24';

  useEffect(() => {
    const fetchComics = async () => {
        setLoading(true);
        try {
            const response = await omanga.getComicsByCategory({ slug, page: currPageNumber });
            if (response && response.data) {
                setItems(response.data);
                setComics((prevComics) => currPageNumber === 1 
                    ? response.data.items 
                    : [...(prevComics || []), ...response.data.items]);
                setTotalLength(response.data.params.pagination.totalItems);
                setShowing(comics.length === 0 ? `${defaultComics}` : `${comics.length}`);
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
        const nextPage = currPageNumber + 1;

        try {
            setLoading(true);

            const response = await omanga.getComicsByCategory({ slug, page: nextPage });

            if (response && response.data) {
                setComics((prevComics) => prevComics ? [...prevComics, ...response.data.items] : response.data.items);
                setCurrPageNumber(nextPage);
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
        <BreadCrumb items={items.breadCrumb} />
        <div id={styles.heading_container}></div>

        {comics && comics.length === 0 && (
        <div id={styles.error_text}>
            <h2>No Results Found</h2>
        </div>
        )}

        {comics && comics.length > 0 && (
            <motion.div>

                <AnimatePresence initial={true} mode="wait">
                    <motion.ul id={styles.results_container} initial="hidden" animate="visible" variants={framerMotionShowUp} >
                        {comics.map((comic, key) => (
                        <motion.li key={comic._id} variants={framerMotionShowUp}>
                            <MediaCard.Container onDarkMode>
                                <MediaCard.MediaImgLinkOmanga
                                    hideOptionsButton={false}
                                    mediaInfo={comic as any}
                                    title={comic.name}
                                    formatOrType="MANGA"
                                    url={omanga.getImageUrl(comic.thumb_url)}
                                    mediaId={comic.slug}
                                />

                                <MediaCard.SmallTag
                                    seasonYear={new Date(comic.updatedAt).getFullYear()}
                                    tags={comic.status}
                                />

                                <MediaCard.LinkTitleOmanga
                                    title={comic.name}
                                />

                            </MediaCard.Container>
                        </motion.li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            </motion.div>
        )}

        {comics && totalLength > comics.length * currPageNumber && (
        <button
            onClick={() => fetchNextResultPage()}
            aria-label={loading ? 'Loading' : 'View More Results'}
        >
            {loading ? 'Loading...' : ' + View more'}
        </button>
        )}

        {comics && comics.length > 0 && (
            <span>
                Showing {(totalLength <= comics.length * currPageNumber) ? 'all ' : showing + ' out of '}
                <span>{totalLength.toLocaleString('en-US')}</span> results
            </span>
        )}

        <span style={{fontSize: 'var(--font-size--small-2)' }}>
            Last Update: {new Date().toLocaleDateString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>


  </div>

  );
};

export default MangaList;
