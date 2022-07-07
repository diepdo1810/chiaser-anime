import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AsideNavLinks from '../../../Components/AsideNavLinks'
import AsideInfo from '../../../Components/MediaPage/AsideInfo'
import * as C from './styles'
import API from '../../../API/anilist'
import AnimePageContent from '../../../Components/MediaPage/AnimePageContent'

export default function AnimePage() {

  const { id } = useParams();
  const type = 'ANIME'

  const [animeInfo, setAnimeInfo] = useState([] as any[])
  // const [animeEpisodes, setAnimeEpisodes] = useState([] as any[])

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {

    const load = async (id: any, type: String) => {

      document.title = 'Loading | AniProject'
      
      window.scrollTo(0, 0);

      setLoading(true)

      const data = await API.getInfoFromThisMedia(id, type);
      setAnimeInfo(data)
      console.log(data)

      setLoading(false)

      document.title = `${data.title.romaji} | AniProject`

    }
    load(id, type)

  }, [id])


  return (
    <C.Container loading={loading}>

      <AsideNavLinks />

      <div className={loading === true ? 'skeleton' : 'main'}>

        <div>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
        </div>

        <div>
          <span className={loading === true ? 'skeleton' : ''}></span>
          <span className={loading === true ? 'skeleton' : ''}></span>
        </div>

        {loading === false && (
          <>
            <AnimePageContent data={animeInfo} />

            <AsideInfo data={animeInfo} />

          </>
        )}

      </div>
    </C.Container>
  )
}
