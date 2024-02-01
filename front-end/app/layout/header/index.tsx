"use client"
import React, { ChangeEvent, useId, useState } from 'react'
import styles from './headerComponent.module.css'
import Image from 'next/image'
import MenuList from '../../../public/assets/list.svg'
import SearchIcon from '../../../public/assets/search.svg'
import PersonIcon from '../../../public/assets/person-circle.svg'
import ChevronDownIcon from '../../../public/assets/chevron-down.svg'
import LoadingIcon from '../../../public/assets/ripple-1s-200px.svg'
import Link from 'next/link'
import API from '../../../api/anilist'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import SearchResultItemCard from '@/app/components/SearchResultItemCard'

function Header() {

    {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/ }
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState<boolean>(false)
    {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/ }
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchResults, setSearchResults] = useState<ApiDefaultResult[] | null>()

    const [searchInput, setSearchInput] = useState<string>("")

    const id = useId()

    async function searchValue(e: React.ChangeEvent<HTMLFormElement> | HTMLFormElement) {

        e.preventDefault()

        const query = searchInput

        if (query.length == 0) return

        setIsLoading(true)

        const result = await API.getSeachResults(query)

        setSearchResults(result as ApiDefaultResult[])

        setIsLoading(false)

    }

    // when clicked, shows serch bar and results, 
    // if clicked again, hide both and erase search results
    function toggleSearchBarMobile() {

        setIsMobileSearchBarOpen(!isMobileSearchBarOpen)
        setSearchResults(null)

    }

    return (
        <header id={styles.background} className={id}>

            <div id={styles.container} className='display_flex_row padding_16px'>

                <div id={styles.menu_and_logo_container} className='display_flex_row align_items_center gap_16px'>
                    <div id={styles.menu_container}>

                        {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/}
                        {/* <button
                            id={styles.btn_open_menu}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-controls={styles.menu_list}
                            aria-label={isMenuOpen ? 'Click to Close Menu' : 'Click to Open Menu'}
                            className={styles.heading_btn}
                        >
                            <MenuList alt="Menu Icon" width={16} height={16} />
                        </button> */}

                        {/* <div id={styles.menu_list} aria-expanded={isMenuOpen}>

                            <ul role='menu'>
                                <li role='menuitem'>Animes</li>
                                <li role='menuitem'>Mangas</li>
                                <li role='menuitem'>Movies</li>
                            </ul>

                        </div>

                        <div id={styles.menu_overlay} onClick={() => setIsMenuOpen(!isMenuOpen)} /> */}

                    </div>

                    <Link href="/">
                        <Image id={styles.logo} src={'/logo.png'} alt='AniProject Website Logo' width={120} height={40} />
                    </Link>
                </div>

                {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/}
                {/* <div id={styles.navbar_container} className={`align_items_center`}>
                    <ul className='display_grid'>
                        <li className='display_flex_row align_items_center'>Animes <ChevronDownIcon alt="Open Animes List" width={16} height={16} /></li>
                        <li className='display_flex_row align_items_center'>Mangas <ChevronDownIcon alt="Open Mangas List" width={16} height={16} /></li>
                        <li className='display_flex_row align_items_center'>Movies <ChevronDownIcon alt="Open Movies List" width={16} height={16} /></li>
                    </ul>
                </div> */}

                <div id={styles.user_and_search_container} className='display_flex_row align_items_center gap_16px'>

                    <div id={styles.search_container}>

                        <button
                            id={styles.btn_open_search_form_mobile}
                            onClick={() => toggleSearchBarMobile()}
                            aria-controls={styles.input_search_bar}
                            aria-label={isMobileSearchBarOpen ? 'Click to Hide Search Bar' : 'Click to Show Search Bar'}
                            className={styles.heading_btn}
                        >
                            <SearchIcon alt="Search Icon" width={16} height={16} />
                        </button>

                        {/* TABLET AND DESKTOP */}
                        <div id={styles.form_search}>

                            <form onSubmit={(e) => searchValue(e as HTMLFormElement | ChangeEvent<HTMLFormElement>)} className={`${styles.search_form} display_flex_row`}>
                                <input type="text" placeholder='Search...' name='searchField' disabled={isLoading} onChange={(e) => setSearchInput(e.target.value)}></input>
                                <button type='submit' disabled={isLoading}>
                                    {isLoading ?
                                        (<LoadingIcon alt="Loading Icon" width={16} height={16} />) :
                                        (<SearchIcon alt="Search Icon" width={16} height={16} />)
                                    }
                                </button>
                            </form>

                        </div>

                        {/* MOBILE */}
                        <div id={styles.form_mobile_search} aria-expanded={isMobileSearchBarOpen} className='display_align_justify_center'>

                            <form onSubmit={(e) => searchValue(e as HTMLFormElement | ChangeEvent<HTMLFormElement>)} className={`${styles.search_form} display_flex_row`}>
                                <input type="text" placeholder='Search...' name='searchField' disabled={isLoading} onChange={(e) => setSearchInput(e.target.value)}></input>
                                <button type='submit' disabled={isLoading}>
                                    {isLoading ?
                                        (<LoadingIcon alt="Loading Icon" width={16} height={16} />) :
                                        (<SearchIcon alt="Search Icon" width={16} height={16} />)
                                    }
                                </button>
                            </form>

                        </div>

                    </div>

                    {/* SEARCH RESULTS */}
                    {searchResults != null && (
                        <div id={styles.search_results_container}>

                            <button onClick={() => setSearchResults(null)}>Clear Search</button>

                            <ul>
                                {searchResults.slice(0, 6).map((item: ApiDefaultResult, key: number) => (
                                    <SearchResultItemCard key={key} item={item} />
                                ))}
                            </ul>

                        </div>
                    )}

                    {/* USER -- RIGHT SIDE OF SCREEN */}
                    {/* WILL BE USED WHEN A BACK-END IS SET UP, AND NEW ROUTES CREATED*/}
                    {/* <div id={styles.user_container}>

                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            aria-controls={styles.user_menu_list}
                            aria-label={isUserMenuOpen ? 'Click to Hide User Menu' : 'Click to Show User Menu'}
                            className={styles.heading_btn}
                        >
                            <PersonIcon alt="User Icon" width={16} height={16} />
                        </button>

                        <div id={styles.user_menu_list} aria-expanded={isUserMenuOpen}>

                            <ul role='menu'>
                                <li role='menuitem'>Login</li>
                                <li role='menuitem'>Sign Up</li>
                            </ul>

                        </div>

                        <div id={styles.user_menu_overlay} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} />

                    </div> */}

                </div>
            </div>
        </header >
    )
}

export default Header