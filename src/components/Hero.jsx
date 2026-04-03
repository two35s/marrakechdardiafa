import { useState, useEffect, useCallback } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80',
    alt: 'Luxury Marrakech riad courtyard with fountain'
  },
  {
    src: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
    alt: 'Marrakech Medina streets and architecture'
  },
  {
    src: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1200&q=80',
    alt: 'Traditional Moroccan riad interior with zellige tilework'
  },
  {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    alt: 'Elegant Marrakech hotel pool and terrace'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">marrakech<span className="hero-title-accent">dar diafa</span></h1>
        <p className="hero-subtitle">Find your perfect place to stay</p>
        <div className="hero-image-wrap">
          <div className="hero-slideshow">
            {heroSlides.map((slide, i) => (
              <img
                key={i}
                src={slide.src}
                alt={slide.alt}
                className={`hero-img hero-slide ${i === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="hero-slide-controls">
            <button className="hero-slide-arrow hero-slide-arrow-left" onClick={prevSlide} type="button" aria-label="Previous slide">
              <CaretLeft size={24} weight="bold" />
            </button>
            <button className="hero-slide-arrow hero-slide-arrow-right" onClick={nextSlide} type="button" aria-label="Next slide">
              <CaretRight size={24} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
