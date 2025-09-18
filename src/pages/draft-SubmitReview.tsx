import { useState } from "react";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

import { resizeImage } from "../utils/resizeImage";
import "./SubmitReview.css";

const IMGUR_CLIENT_ID = "YOUR_IMGUR_CLIENT_ID"; // 👈 replace with your Imgur client ID

function draftSubmitReview() {
    const [rating, setRating] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

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
            let imageUrl = "";

            // upload to Imgur if user selected an image
            if (compressedBlob) {
                const formData = new FormData();
                formData.append("image", compressedBlob);

                const res = await fetch("https://api.imgur.com/3/image", {
                    method: "POST",
                    headers: {
                        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                    },
                    body: formData,
                });

                const data = await res.json();
                if (data.success) imageUrl = data.data.link;
                else console.error("Imgur upload failed", data);
            }

            const reviewsRef = collection(doc(db, "users", userUid), "reviews");

            await addDoc(reviewsRef, {
                image: imageUrl, // optional
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
            setFile(null);
            setCompressedBlob(null);
            setPreview(null);
        } catch (err) {
            console.error("Error adding review:", err);
        }
    };

    return (
        <div className="submit-review">
            <h2>Leave a Review</h2>
            <form className="review-form" onSubmit={handleSubmit}>
                <label htmlFor="image">Profile Picture</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={async (e) => {
                        const selected = e.target.files?.[0] || null;
                        setFile(selected);

                        if (selected) {
                            try {
                                const blob = await resizeImage(selected, 800, 800, 0.7);
                                setCompressedBlob(blob);
                                const previewUrl = URL.createObjectURL(blob);
                                setPreview(previewUrl);
                            } catch (err) {
                                console.error("Error compressing preview:", err);
                            }
                        } else {
                            setCompressedBlob(null);
                            setPreview(null);
                        }
                    }}
                />
                {preview && (
                    <div className="image-preview">
                        <p>Image Preview (compressed):</p>
                        <img src={preview} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                    </div>
                )}

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

export default draftSubmitReview;
