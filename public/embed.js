const container = document.querySelector('#reviewservice');
const currentScript = document.currentScript;
const uid = currentScript.dataset.id;

const style = document.createElement('style');
style.textContent = `
    #reviewservice {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        gap: 10px;
        padding: 5px;
        max-width: 500px;
    }
    .widget-preview {
        display: flex;
        flex-direction: row;
        gap: 5px;
        border: 2px solid black;
        border-radius: 3px;
        padding: 10px;
        width: 97%;
    }
    .user-info {
        width: 40%;
    }
    .user-info img {
        border-radius: 50%;
        height: 13vh;
        width: 13vh;
        object-fit: cover;
        object-position: center;
        border: 3px solid rgb(155, 155, 155, 0.3);
    }

    .testimonial-info {
        width: 60%;
    }
    .testimonial {
        border: 1px solid grey;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: left;
        gap: 3px;
        padding: 4px;
    }
    .myText {
        display: -webkit-box;
        -webkit-line-clamp: 5; /* limit to 3 lines */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.3s ease;
        padding: 2px;
    }
    .expanded {
        -webkit-line-clamp: unset;
        overflow: visible;
    }
`;
document.head.appendChild(style);

(async () => {
    // 1. Load Firebase v8 App SDK
    await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });

    // 2. Load Firebase v8 Firestore SDK
    await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });

    // 3. Initialize Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyDkQmA8bdwOGcR4Y_552sgJ8fKebv3zCd8",
        authDomain: "reviewservice-uri.firebaseapp.com",
        projectId: "reviewservice-uri",
        storageBucket: "reviewservice-uri.firebasestorage.app",
        messagingSenderId: "593778065867",
        appId: "1:593778065867:web:6ddb374aaf58d5ef23b64e",
        measurementId: "G-3CCR4HX2PY"
    });

    const db = firebase.firestore();

    // 5. Fetch and render reviews
    function getStars(num) {
        let starsString = '';
        for (let i = 0; i < num; i++) {
            starsString += '&#9733; ';
        }
        return starsString;
    }

    try {
        const reviewsRef = db.collection('users').doc(uid).collection('reviews');
        const querySnapshot = await reviewsRef.get();

        if (querySnapshot.empty) {
            container.innerHTML = `<p>No reviews yet.</p>`;
            return;
        }

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const html = `
                <div class="widget-preview">
                    <div class="user-info">
                        <p class="name-preview"><strong>${data.name}</strong></p>
                        <p class="business-preview">${data.business}</p>
                    </div>
                    <div class="testimonial-info">
                        <p class="service-product"><strong>Service</strong>: ${data.service}</p>
                        <div class="stars">${getStars(data.stars)}</div>
                        <div class="testimonial">
                            <p class="myText">${data.testimonial}</p>
                            <button class="toggleButton">Show more</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;

            document.querySelectorAll(".testimonial").forEach(testimonial => {
                const button = testimonial.querySelector(".toggleButton");
                const text = testimonial.querySelector(".myText");

                button.addEventListener("click", () => {
                    text.classList.toggle("expanded");
                    button.textContent = text.classList.contains("expanded") ? "Show less" : "Show more";
                });
            });
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        container.innerHTML = `<p>Error loading reviews.</p>`;
    }
})();

