"use client";
import React, { useEffect, useState } from 'react';
import styles from './component.module.css';
import omanga from '@/app/api/oManga';
import Link from 'next/link';
import ErrorPlaceholder from '../ErrorPlaceholder';
import { MangaGenreResponse } from '@/app/ts/interfaces/apiOMangaDataInterface'

const chunkArray = (array: MangaGenreResponse[], size: number) => {
    const result: MangaGenreResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
};

function CategoryNavList() {
    const [categories, setCategories] = useState<MangaGenreResponse[] | null>([]);
    const [error, setError] = useState(false);
    const chunkSize = 10;

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await omanga.getCategories() as MangaGenreResponse[];
            setCategories(data?.data.items);
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
        </ul>
    );
}

export default CategoryNavList;
