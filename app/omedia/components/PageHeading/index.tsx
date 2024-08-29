import React from 'react';
import HeadingInfo from './HeadingInfo';
import GridInfo from './GridInfo';
import { MangaResponse } from '@/app/ts/interfaces/apiOMangaDataInterface';

export default function PageHeading({ mangaInfo }: { mangaInfo: MangaResponse }) {

    return (
        <React.Fragment>
            <HeadingInfo
                mangaInfo={mangaInfo}
            />

            <GridInfo
                mangaInfo={mangaInfo}
            />
        </React.Fragment>
    );
}
