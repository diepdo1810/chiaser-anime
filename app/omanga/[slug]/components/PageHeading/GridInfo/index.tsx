import React from 'react';
import BookSvg from '@/public/assets/book.svg';
import CalendarSvg from '@/public/assets/calendar3.svg';
import ProgressSvg from '@/public/assets/progress.svg';
import styles from './component.module.css';
import { MangaResponse } from '@/app/ts/interfaces/apiOMangaDataInterface';
import stringToOnlyAlphabetic from '@/app/lib/convertStrings';
import { getMediaReleaseDate } from '@/app/lib/formatDateUnix';

export default function MangaInfo({ mangaInfo }: { mangaInfo: MangaResponse }) {
    const item = mangaInfo.item;
    const status = item.status;
    const chapters = item.chapters;
    const updatedAt = item.updatedAt;

    function convertMangaStatus(status: string) {
        if (status === 'ongoing') {
            return 'ONGOING';
        } else if (status === 'completed') {
            return 'COMPLETED';
        }
        return stringToOnlyAlphabetic(status) || 'Not Available';
    }

    const chaptersDisplay = typeof chapters === 'number' || typeof chapters === 'string' ? chapters : 'Not Available';

    const releaseDateDisplay = getMediaReleaseDate(updatedAt ? { month: new Date(updatedAt).getMonth() + 1, day: new Date(updatedAt).getDate(), year: new Date(updatedAt).getFullYear() } : undefined) || 'Not Available';

    return (
        <section id={styles.info_list_container}>
            <ul>
                <li className={`${styles.info_item}`}>
                    <span>
                        <ProgressSvg width={16} height={16} alt="Status" />
                    </span>
                    <h2>AUTHOR</h2>
                    <p>{item.author !== '' ? item.author : 'Anonymous'}</p>
                </li>

                <li className={`${styles.info_item}`}>
                    <span>
                        <ProgressSvg width={16} height={16} alt="Status" />
                    </span>
                    <h2>STATUS</h2>
                    <p>{convertMangaStatus(status || 'Not Available')}</p>
                </li>

                <li className={`${styles.info_item}`}>
                    <span>
                        <BookSvg width={16} height={16} alt="Chapters" />
                    </span>
                    <h2>CHAPTERS</h2>
                    <p>{chaptersDisplay}</p>
                </li>

                <li className={`${styles.info_item}`}>
                    <span>
                        <CalendarSvg width={16} height={16} alt="Release" />
                    </span>
                    <h2>RELEASE</h2>
                    <p className={styles.width_min_content}>
                        {releaseDateDisplay}
                    </p>
                </li>
            </ul>
        </section>
    );
}
