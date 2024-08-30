import React from 'react'
import styles from "./page.module.css"
import oManga from '@/app/api/oManga'
import { MangaChapters, MangaInfo } from '@/app/ts/interfaces/apiMangadexDataInterface'
import ChaptersPages from './components/ChaptersPages/index'
import ChaptersListContainer from './components/ChaptersListContainer/index'
import { MangaResponse } from "@/app/ts/interfaces/apiOMangaDataInterface";

export const revalidate = 1800 // revalidate cached data every 30 minutes

async function ReadChapter({ params, searchParams }: {
    params: { id: number }, // Manga ID
    searchParams: { slug: string, page: string} // Chapter ID, Episode ID, Last Page 
}) {
    const mangaSlug = searchParams.slug; // Sử dụng slug từ searchParams

    // Lấy thông tin manga
    const { data } = (await oManga.getComicDetail(mangaSlug)) as MangaResponse
    if (!data) {
        return <div>Error loading manga details.</div>;
    }

    const mangaData = data.item;
    const chaptersList = mangaData.chapters[0];
    
    const mangaSId = params.id; // Assuming `id` is used as slug here

    const chapterApiUrl = `${oManga.CDN_CHAPTER_URL}/${mangaSId}`;
    let currChapterInfo: MangaChapters | undefined = undefined
    let hadFetchError = false

    // Fetch chapter details
    const chapterDetailsResponse = await oManga.fetchChapterDetails(chapterApiUrl);
    if (!chapterDetailsResponse || chapterDetailsResponse.status !== "success") {
        hadFetchError = true;
    }

    const chapterData = chapterDetailsResponse?.data?.item;

    if (chapterData) {
        currChapterInfo = {
            id: chapterData._id,
            title: chapterData.chapter_title,
            chapterNumber: chapterData.chapter_name,
            volumeNumber: chapterData.volume_name,
            pages: chapterData.chapter_image.length,
        };
    
    } else {
        hadFetchError = true;
    }


    return (
        <main id={styles.container}>

            <div id={styles.heading_container}>

                <h1>
                    <span>{currChapterInfo?.title || "Unknown Title"}</span>
                </h1>

                <small>{currChapterInfo?.pages} Pages</small>

            </div>

            <ChaptersPages
                chapters={chapterData?.chapter_image.map((img: any, index: number) => ({
                    imageUrl: `${chapterDetailsResponse.data.domain_cdn}/${chapterData.chapter_path}/${img.image_file}`,
                    pageNumber: img.image_page,
                })) || []}
                initialPage={Number(searchParams.page) || undefined}
            />

            <div id={styles.all_chapters_container}>
            <ChaptersListContainer
                mangaSlug={mangaData.slug}
                currChapterId={currChapterInfo?.id || ""}
                chaptersList={chaptersList || []}
            />

            </div>

        </main>
    )
}

export default ReadChapter
