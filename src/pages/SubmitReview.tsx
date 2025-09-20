import { useState } from "react";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { resizeImage } from "../utils/resizeImage";

import "./SubmitReview.css";

function SubmitReview() {
    const [rating, setRating] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState("");
    const [formData, setFormData] = useState<FormData | null>(null);

    // grab user UID from URL
    const urlParts = window.location.pathname.split("/");
    const userUid = urlParts[urlParts.length - 1];

    // set imageUrl and formData
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        // resize image
        const resizedFile = await resizeImage(file, 500, 500, 0.8);

        // prepare cloudData for Cloudinary upload
        const cloudData = new FormData();
        cloudData.append("file", resizedFile);
        cloudData.append("upload_preset", "testimonial-images"); // from Cloudinary settings

        // set formData and previewUrl
        setPreviewUrl(URL.createObjectURL(resizedFile));
        setFormData(cloudData);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
        const business = (form.elements.namedItem("business") as HTMLInputElement).value.trim();
        const service = (form.elements.namedItem("service") as HTMLInputElement).value.trim();
        const testimonial = (form.elements.namedItem("testimonial") as HTMLTextAreaElement).value.trim();

        // set formData public_id
        const uniqueId = `${userUid}_${name}_${service}`;
        formData?.append("public_id", uniqueId);

        try {
            // upload formData to Cloudinary
            const res = await fetch(
            "https://api.cloudinary.com/v1_1/duzgqrbqe/image/upload",
            {
                method: "POST",
                body: formData,
            }
            );
            const data = await res.json();

            // get reviewsRef and add the review
            const reviewsRef = collection(doc(db, "users", userUid), "reviews");

            await addDoc(reviewsRef, {
                approved: false,
                //`https://res.cloudinary.com/duzgqrbqe/image/upload/v1758380695/${uniqueId}`
                image: data.secure_url,
                name,
                business,
                service,
                stars: rating,
                testimonial,
                createdAt: serverTimestamp(),
            });

            console.log("Review submitted successfully!");
            form.reset();
            setPreviewUrl("");
            setRating(0);
        } catch (err) {
            console.error("Error adding review:", err);
        }
    };

    return (
        <div className="submit-review">
            <h2>Leave a Review</h2>
            <form className="review-form" onSubmit={handleSubmit}>
                <label htmlFor="image">Photo or Logo (optional)</label>
                <input type="file" id="image" accept="image/*" onChange={handleUpload}/>
                {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px" }}/>
                }

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