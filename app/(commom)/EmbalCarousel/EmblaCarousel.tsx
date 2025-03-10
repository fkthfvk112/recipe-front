"use client";
import React, { useCallback, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { flushSync } from "react-dom";
import "./embla.css";
import Image from "next/image";
import ImgModal from "../Component/ImgModal";

const TWEEN_FACTOR = 3;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type PropType = {
  imgUrls: string[];
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const [modalImg, setModalImg]  = useState<string>("");
  const [modalOpen, openImgModal] = useState<boolean>(false);

  const clickImgModalOpen = (imgStr:string)=>{
      setModalImg(imgStr);
      openImgModal(true);
  }

  const imageByIndex = (index: number): string =>
    props.imgUrls[index % props.imgUrls.length];

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      return numberWithinRange(tweenValue, 0, 1);
    });
    setTweenValues(styles);
  }, [emblaApi, setTweenValues]);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll();
    emblaApi.on("scroll", () => {
      flushSync(() => onScroll());
    });
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  return (
    <>
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla_img_slide" key={index}>
              <Image
                className="inner-img"
                src={imageByIndex(index)}
                alt="no img"
                fill
                onClick={()=>clickImgModalOpen(imageByIndex(index))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    <ImgModal modalOpen={modalOpen} setModalOpen={openImgModal} modalImg={modalImg}/>
    </>
  );
};

export default EmblaCarousel;
