"use client";
import React, { useCallback, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import "./embla_comp.css";


type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaCarousel_comp: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  console.log("슬라이드", slides);
  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef} >
        <div className="embla__container">
          {slides.map((comp, inx) => (
            <div className="embla__slide" key={inx}>
              {comp}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel_comp;
