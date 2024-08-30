import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_OMANGA_API_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_OMANGA_CDN_IMAGE_URL;
const CDN_CHAPTER_URL = process.env.NEXT_PUBLIC_OMANGA_CDN_CHAPTER_URL;

axiosRetry(Axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 1500,
    retryCondition: (error) => error.response?.status === 500 || error.response?.status === 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber} ${retryNumber === 3 ? " - Last Attempt" : ""}`)
});

export default {

    // GET HOME DATA
    getHomeData: cache(async () => {
        try {
            const { data } = await Axios.get(`${API_URL}/home`);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }),

    // GET LIST OF COMICS BY TYPE
    getComicsByType: cache(async ({ type, page }: { type: string; page?: number }) => {
        try {
            const { data } = await Axios.get(`${API_URL}/danh-sach/${type}${page ? `?page=${page}` : ''}`);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }),

    // GET CATEGORIES
    getCategories: cache(async () => {
        try {
            const { data } = await Axios.get(`${API_URL}/the-loai`);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }),

    // GET COMICS BY CATEGORY
    getComicsByCategory: cache(async ({ slug, page }: { slug: string; page?: number }) => {
        try {
            const { data } = await Axios.get(`${API_URL}/the-loai/${slug}${page ? `?page=${page}` : ''}`);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }),

    // GET COMIC DETAIL
    getComicDetail: cache(async (slug: string) => {
        try {
            const { data } = await Axios.get(`${API_URL}/truyen-tranh/${slug}`);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }),

    // SEARCH COMICS
    searchComics: cache(async (keyword: string) => {
        try {
            const { data } = await Axios.get(`${API_URL}/tim-kiem?keyword=${keyword}`);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }),

    // image_url
    getImageUrl: (url: string) => {
        return `${IMAGE_URL}/${url}`;
    },

    fetchChapterDetails: cache(async (chapterApiUrl: string) => {
        try {
            const { data } = await Axios.get(chapterApiUrl);
            return data;
        } catch (error) {
            console.error("Error fetching chapter details:", error);
            return null;
        }
    }),

    // get constant CDN_CHAPTER_URL
    get CDN_CHAPTER_URL() {
        return CDN_CHAPTER_URL;
    },
}
