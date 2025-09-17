import { useState } from 'react';
import './Testimonial.css';

type TestimonialProps = {
    image: string;
    name: string;
    business: string;
    service: string;
    stars: number;
    text: string;
}

const Testimonial = ({ image, name, business, service, stars, text }: TestimonialProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="testimonial">
            <div className="user-info">
                <img className="preview-image" src={image} alt=""/>
                <p className="name-preview"><strong>{name}</strong></p>
                <p className="business-preview">{business}</p>
            </div>
            <div className="testimonial-info">
                <p className="service-product"><u>Service</u>: {service}</p>
                <div className="stars">
                    {Array.from({ length: stars }, (_, i) => (
                        <span key={i}>&#9733;</span>
                    ))}
                </div>
                <div className="testimonial-text">
                    <p className={`myText ${expanded ? "expanded" : ""}`}>
                        {text}
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