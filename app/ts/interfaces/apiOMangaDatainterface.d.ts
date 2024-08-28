
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
