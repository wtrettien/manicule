import React from 'react'

import { Image } from 'react-bootstrap'
import { EditionName } from '../utils/metadata'
import { ZoomModal } from './reader'

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
    setZoom: (_: ZoomModal) => void
}
const PageImage = ({ edition, num, setZoom }: PageImageProps) => {
    const img = getImageUrl(edition, num)
    return (
        <>
            <Image src={img} alt="" responsive onClick={() => setZoom(num)} />
        </>
    )
}

export default PageImage
