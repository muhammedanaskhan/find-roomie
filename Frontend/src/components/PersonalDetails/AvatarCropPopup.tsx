import React, { useCallback, useState } from 'react'
import styles from './AvatarCropPopup.module.css'

import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
} from '@chakra-ui/react'

import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Button } from '../ui/button';
import Image from 'next/image';
import getCroppedImg from '@/utils/Crop';
import { set } from 'nprogress';

interface Props {
    file: File | undefined
    closeModal: () => void
    onCroppedImageFile: (file: File) => void
}
function AvatarCropPopup({ file, closeModal, onCroppedImageFile }: Props) {

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | undefined>();
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);

    const imageUrl = file ? URL.createObjectURL(file) : '';

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageUrl,
                croppedAreaPixels,
                0
            );
            setCroppedImage(croppedImage);

            if (croppedImage) {
                const response = await fetch(croppedImage);
                const blob = await response.blob();

                const file = new File([blob], "cropped_image.jpeg", { type: "image/jpeg" });
                setCroppedImageFile(file);
                onCroppedImageFile(file);
                closeModal();
            }

        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageUrl]);

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <Image onClick={closeModal} src="/cross.svg" width={3.5} height={3.5} alt="cross" className="absolute top-5 right-5 w-3.5 z-10 cursor-pointer" />
                <div className="relative h-52 w-full border overflow-hidden rounded-lg">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={5 / 5}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape="round"
                    />
                </div>
                <p className=' font-inter text-lg font-medium mt-5'>zoom</p>
                <div className="controls mt-2">
                    <Slider
                        aria-label='slider-ex-1'
                        min={1}
                        max={3}
                        value={zoom}
                        step={0.1}
                        onChange={(zoom) => setZoom(Number(zoom))}
                        width={200}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </div>
                <Button onClick={showCroppedImage} className='mt-5 bg-primaryBlue hover:bg-slate-300 hover:text-black'>Set as Profile Picture</Button>
            </div>
        </div>
    )
}

export default AvatarCropPopup