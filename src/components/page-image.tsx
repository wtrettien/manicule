import React from 'react'

import { Image } from 'react-bootstrap'
import { EditionName } from '../utils/metadata'

export const getImageUrl = (edition: EditionName, num: number, thumbnail = false) => {
    const pad = `0000${num}`.substr(-4, 4)
    const img = thumbnail
        ? `${process.env.PUBLIC_URL}/images/book/${edition}/thumbnails/${pad}.jpg`
        : `${process.env.PUBLIC_URL}/images/book/${edition}/${pad}.jpg`
    return img
}

interface PageImageProps {
    edition: EditionName
    num: number
    toggleZoom: any
}
const PageImage = ({ edition, num, toggleZoom }: PageImageProps) => {
    const img = getImageUrl(edition, num)
    return (
        <>
            <Image src={img} alt="" responsive onClick={() => toggleZoom(img)} />
        </>
    )
}

export default PageImage