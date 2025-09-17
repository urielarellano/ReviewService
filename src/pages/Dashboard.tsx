import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase.js';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import Testimonial from '../components/Testimonial';
import './Dashboard.css';
import floria from '../assets/floria-elizabeth.png';


interface Review {
    approved: boolean
    image: string
    name: string
    bizName: string
    service: string
    stars: number
    testimonial: string
}

// displayed when a user is signed in
function Dashboard() {
    const [business, setBusiness] = useState<string>('');
    const [reviews, setReviews] = useState<Review[]>([]);

    // set uid, business, and reviews
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchUserInfo = async () => {
                    const docRef = doc(db, 'users', user.uid);
                    
                    // set business
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setBusiness(docSnap.data().business);
                    }

                    // set reviews
                    const reviewsRef = collection(docRef, 'reviews');
                    const querySnapshot = await getDocs(reviewsRef);
                    
                    const newReviews: Review[] = querySnapshot.docs.map((doc) => ({
                        approved: false,
                        image: floria,
                        name: doc.data().name,
                        bizName: doc.data().business,
                        service: doc.data().service,
                        stars: doc.data().stars,
                        testimonial: doc.data().testimonial,
                    }));

                    setReviews((prev) => [...prev, ...newReviews]);
                };
                fetchUserInfo();
            }
        });
        return () => unsubscribe(); // cleanup
    }, []);


    return (
        <>
            <div className="dashboard-intro">
                <br />
                <h2>Reviews for {business}</h2>
                <br />
            </div>

            <div className="dashboard-reviews">
                {reviews.map((currReview, i) => (
                    <Testimonial key={i}
                        image={currReview.image}
                        name={currReview.name}
                        business={currReview.bizName}
                        service={currReview.service}
                        stars={currReview.stars}
                        text={currReview.testimonial}
                    />
                ))}
            </div>
        </>
    )
}

export default Dashboard;