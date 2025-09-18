import { useState } from 'react';
import './Testimonial.css';
import type { Review } from '../types/review';

type TestimonialProps = {
    review: Review
}

const Testimonial = ({ review }: TestimonialProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="testimonial">
            <div className="user-info">
                <img className="preview-image" src={review.image} alt=""/>
                <p className="name-preview"><strong>{review.name}</strong></p>
                <p className="business-preview">{review.bizName}</p>
            </div>
            <div className="testimonial-info">
                <p className="service-product"><u>Service</u>: {review.service}</p>
                <div className="stars">
                    {Array.from({ length: review.stars }, (_, i) => (
                        <span key={i}>&#9733;</span>
                    ))}
                </div>
                <div className="testimonial-text">
                    <p className={`myText ${expanded ? "expanded" : ""}`}>
                        {review.testimonial}
                    </p>
                    <button className="toggleButton"
                            onClick={() => setExpanded(prev => !prev)}>
                        {expanded ? "Show less" : "Show more"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Testimonial;