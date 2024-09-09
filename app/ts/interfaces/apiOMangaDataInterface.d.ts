
export interface MangaGenre {
    _id: string;  
    slug: string;
    name: string;
}

export interface MangaGenreResponse {
    status: string;
    message: string;
    data: {
        items: MangaGenre[];
    }
}

export interface MangaItem {
    _id: string;
    name: string;
    slug: string;
    origin_name: string[];
    status: string;
    thumb_url: string;
    sub_docquyen: boolean;
    category: {
        id: string;
        name: string;
        slug: string;
    }[];
    updatedAt: string;
    chaptersLatest: any;
}

export interface ParamItem {
    type_slug: string;
    slug: string;
    filterCategory: string[];
    sortField: string;
    sortType: string;
    pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        pageRanges: number;
    }
}

export interface MangaCategoryResponse {
    status: string;
    message: string;
    data: {
        seoOnPage: {
            og_type: string;
            titleHead: string;
            og_image: string[];
            og_url: string;
        };
        breadCrumb: {
            name: string;
            slug?: string;
            isCurrent: boolean;
            position: number;
        }[];
        titlePage: string;
        items: MangaItem[];
        params: ParamItem[];
    };
}

// apiOMangaDataInterface.d.ts

export interface MangaItem {
    _id: string;
    name: string;
    slug: string;
    origin_name: string[];
    content: string;
    status: string;
    thumb_url: string;
    sub_docquyen: boolean;
    author: string[];
    category: {
        id: string;
        name: string;
        slug: string;
    }[];
    chapters: any[];
    updatedAt: string;
}

export interface MangaResponse {
    status: string;
    message: string;
    data: {
        seoOnPage: {
            og_type: string;
            titleHead: string;
            seoSchema: {
                "@context": string;
                "@type": string;
                name: string;
                url: string;
                image: string;
                director: string;
            };
            descriptionHead: string;
            og_image: string[];
            updated_time: number;
            og_url: string;
        };
        breadCrumb: {
            name: string;
            slug?: string;
            position: number;
            isCurrent?: boolean;
        }[];
        params: {
            slug: string;
            crawl_check_url: string;
        };
        item: MangaItem;
        APP_DOMAIN_CDN_IMAGE: string;
    };
}

type ChapterImage = {
    image_page: number;
    image_file: string;
};

interface ChapterData {
    domain_cdn: string;
    chapter_path: string;
    chapter_image: ChapterImage[];
}

interface ChaptersPagesProps {
    chapterData: ChapterData;
    initialPage?: number;
}

export interface MangaChapters {
    id: string,
    chapterNumber: string,
    volumeNumber: string,
    title: string,
    pages: number,
    name: string
}