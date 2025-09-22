import { useState } from 'react';
import './WidgetPreview.css';
import floria from '../assets/floria-elizabeth.png';


function WidgetTestimonial() {
    const [expanded, setExpanded] = useState(false);

    const review = {
        id: "",
        approved: false,
        image: "",
        name: "Floria Elizabeth",
        bizName: "Floria Flowers",
        service: "Marketing Funnel Optimization",
        stars: 5,
        testimonial: "I cannot say enough good things about Arellano Advertising! They helped my flower business go from a smaller local store to a well-known regional flower business. The results spoke for themselves and the sales they produced more than justified the price. Highly recommended!",
        createdAt: new Date()
    }


    return (
            <div className="widget-testimonial">
                <div className="widget-user-info">
                    <img className="widget-image" src={floria} alt=""/>
                    <p className="widget-name"><strong>{review.name}</strong></p>
                    <p className="widget-business">{review.bizName}</p>
                </div>
                <div className="widget-testimonial-info">
                    <div className="widget-stars">
                        {Array.from({ length: review.stars }, (_, i) => (
                            <span key={i}>&#9733;</span>
                        ))}
                    </div>
                    <p className="widget-service"><u>Service</u>: {review.service}</p>
                    <div className="widget-testimonial-text">
                        <p className={`widget-text ${expanded ? "expanded" : ""}`}>
                            {review.testimonial}
                        </p>
                        <div className="widget-toggle"
                            onClick={() => setExpanded(prev => !prev)}>
                            {expanded ? "Show less" : "Show more"}
                        </div>
                    </div>
                </div>
            </div>
        
    )
}

export default WidgetTestimonial;