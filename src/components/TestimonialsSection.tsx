import { useLanguage } from '../language'
import { useState } from 'react'
import { googleReviewFormUrl, googleReviewSnapshot } from '../data/google-reviews'
import { Arrow } from './UI'
import './TestimonialsSection.css'

function ReviewStars() {
  const { t } = useLanguage()
  return <span className="testimonial-stars" role="img" aria-label={t("5 out of 5 stars")}>{[0, 1, 2, 3, 4].map(star => <svg key={star} viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9Z" /></svg>)}</span>
}

export default function TestimonialsSection() {
  const { t, isTamil } = useLanguage()
  const [expandedReviews, setExpandedReviews] = useState<string[]>([])
  return <section className="section home-testimonials" aria-labelledby="testimonials-heading">
    <div className="agai-container">
      <div className="testimonials-heading">
        <div><p className="home-unified-eyebrow">{t("Words from our community")}</p><h2 id="testimonials-heading" className="home-unified-title">{t("Their words.")} <span>{t("Their experience.")}</span></h2><p className="testimonials-introduction">{t("A few of the experiences shared about AGAI Physiotherapy Centre on Google.")}</p></div>
        <div className="testimonials-rating" aria-label={t("Google review rating snapshot")}>
          <span className="testimonials-google-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.36Z" /><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59Z" /><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z" /></svg></span>
          <div className="testimonials-rating-copy"><div className="testimonials-rating-value"><strong>{googleReviewSnapshot.rating}<span className="visually-hidden">{isTamil ? ' / 5' : ' out of 5'}</span></strong><ReviewStars /></div><span className="testimonials-source">{isTamil ? `Google · ${googleReviewSnapshot.reviewCount} கருத்துகள்` : `Google reviews · ${googleReviewSnapshot.reviewCount} reviews`}</span><p>{t("Rating at time of capture.")}</p></div>
        </div>
      </div>
      <div className="testimonials-grid">
        {googleReviewSnapshot.reviews.map((review, index) => <figure className="testimonial-card" key={review.name}>
          <div className="testimonial-card-top"><span className="testimonial-category" lang="en">{review.category}</span><span className="testimonial-quote-mark" aria-hidden="true">“</span></div>
          <div className="testimonial-card-rating"><ReviewStars /></div>
          <blockquote lang="en"><p id={`testimonial-text-${index}`}>{review.preview && !expandedReviews.includes(review.name) ? `${review.preview} …` : review.text}</p></blockquote>
          {review.preview ? <button className="testimonial-read-more" type="button" aria-expanded={expandedReviews.includes(review.name)} aria-controls={`testimonial-text-${index}`} onClick={() => setExpandedReviews(current => current.includes(review.name) ? current.filter(name => name !== review.name) : [...current, review.name])}>{expandedReviews.includes(review.name) ? t('Show less') : t('Read full review')}<span className="visually-hidden"> {isTamil ? '—' : 'by'} {review.name}</span></button> : null}
          <figcaption><span className="testimonial-avatar" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}${review.image}`} alt="" width="42" height="42" loading="lazy" decoding="async" /></span><div><strong>{review.name}</strong><span>{t("Google review")}</span></div></figcaption>
        </figure>)}
      </div>
      <div className="testimonials-footer"><p>{t("Read more experiences and see the latest rating on Google.")}</p><a href={googleReviewSnapshot.reviewsUrl} target="_blank" rel="noopener noreferrer">{t("View all reviews")} <Arrow diagonal /></a></div>
      <div className="testimonials-review">
        <a className="testimonials-review-button" href={googleReviewFormUrl} target="_blank" rel="noopener noreferrer" aria-describedby="testimonials-review-note">
          <span>{t("Write a Google review")}</span><span className="testimonials-review-arrow" aria-hidden="true"><Arrow diagonal /></span>
        </a>
        <span id="testimonials-review-note" className="visually-hidden">{t("Opens Google in a new tab. Google sign-in required.")}</span>
      </div>
    </div>
  </section>
}
