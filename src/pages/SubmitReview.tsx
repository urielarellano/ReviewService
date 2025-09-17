import { useState } from "react";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

import "./SubmitReview.css";

function SubmitReview() {
    const [rating, setRating] = useState<number>(0);

    // grab user UID from URL
    const urlParts = window.location.pathname.split("/");
    const userUid = urlParts[urlParts.length - 1];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const business = (form.elements.namedItem("business") as HTMLInputElement).value.trim();
        const service = (form.elements.namedItem("service") as HTMLInputElement).value.trim();
        const testimonial = (form.elements.namedItem("testimonial") as HTMLTextAreaElement).value.trim();

        try {
            const reviewsRef = collection(doc(db, "users", userUid), "reviews");

            await addDoc(reviewsRef, {
                name,
                business,
                service,
                stars: rating,
                testimonial,
                createdAt: serverTimestamp(),
                approved: false,
            });

            console.log("Review submitted successfully!");
            form.reset();
            setRating(0);
        } catch (err) {
            console.error("Error adding review:", err);
        }
    };

    return (
        <div className="submit-review">
            <h2>Leave a Review</h2>
            <form className="review-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required />

                <label htmlFor="business">Your Business Name</label>
                <input type="text" id="business" name="business" placeholder="Enter business name" required />

                <label htmlFor="service">Service Purchased</label>
                <input type="text" id="service" name="service" placeholder="Enter the service" required />

                <label>Rating</label>
                <div className="star-rating">
                    {[5, 4, 3, 2, 1].map((value) => (
                        <span
                            key={value}
                            data-value={value}
                            onClick={() => setRating(value)}
                            style={{ cursor: "pointer", color: value <= rating ? "gold" : "#ccc" }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <label htmlFor="testimonial">Testimonial</label>
                <textarea
                    id="testimonial"
                    name="testimonial"
                    rows={4}
                    placeholder="Write your testimonial..."
                    required
                />

                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
}

export default SubmitReview;
