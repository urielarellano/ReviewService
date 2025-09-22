import { useState } from 'react';
import { db } from '../services/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import type { Review } from '../types/review';
import { deleteCloudinaryImage } from '../utils/deleteCloudinaryImage';
import './Testimonial.css';

type TestimonialProps = {
    review: Review;
    onDelete?: (id: string) => void;
}

const Testimonial = ({ review, onDelete }: TestimonialProps) => {
    const [expanded, setExpanded] = useState(false);

    async function deleteTestimonial() {
        try {
            // delete image from Cloudinary
            await deleteCloudinaryImage(`${review.uid}_${review.name}_${review.service}`);

            // delete document on firebase
            const docRef = doc(db, "users", review.uid, "reviews", review.id);
            await deleteDoc(docRef);
            console.log("Testimonial deleted");

            if (onDelete) onDelete(review.id);
        } catch (err) {
            console.error("Failed to copy text", err);
        }
    }

    return (
        <div className="testimonial-outer">
            <div className="delete-testimonial"
                onClick={deleteTestimonial}>
                Delete
            </div>
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
        </div>
    )
}

export default Testimonial;