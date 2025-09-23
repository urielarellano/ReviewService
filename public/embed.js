const container = document.querySelector('#reviewservice');
const newDiv = document.createElement('div');
newDiv.classList.add('widget-preview');
container.appendChild(newDiv);

const currentScript = document.currentScript;
const uid = currentScript.dataset.id;

const style = document.createElement('style');
style.textContent = `
    .widget-preview {
        width: 100vw;
        background: rgb(58, 57, 57);
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        padding: 4px 10px;
        border-top: 9px solid rgb(58, 57, 57);
        box-shadow: 0px 2px 5px rgb(0,0,0,0.6);
        gap: 12px;
        overflow-x: auto;
        max-height: 63vh !important;
    }

    /* testimonial container */
    .widget-testimonial {
        background: #eee;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 2px;
        padding: 15px 10px;
        width: 500px;
        height: auto;
        font-size: 16px;
        overflow: hidden;
    }

    /* user info */
    .widget-user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
        width: 30%;
        border-right: 1px solid black;
    }
    .widget-image {
        border-radius: 50%;
        height: 15vh;
        width: 15vh;
        margin-bottom: 5px;
        object-fit: cover;
        object-position: center;
        box-shadow: 0px 0px 1px rgb(0,0,0,.5);
    }

    /* testimonial info */
    .widget-testimonial-info {
        width: 70%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px 10px;
    }
    .widget-stars {
        font-size: 22px;
        color: rgb(255, 227, 11);
        width: fit-content;
        height: fit-content;
        background: #eee;
        padding: 0px 4px;
        padding-bottom: 2px;
        text-shadow: 0px 0px 2px black;
    }
    .widget-service {
        background: #ccc;
        padding: 3px 10px;
    }
    .widget-testimonial-text {
        display: flex;
        flex-direction: column;
    }

    .widget-text {
        display: -webkit-box;
        -webkit-line-clamp: 4; /* limit to 3 lines */
        line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.3s ease;
        padding: 2px;
        text-align: center;
    }
    .widget-toggle {
        padding: 1px 5px;
        padding-bottom: 2px;
        border-radius: 2px;
        cursor: pointer;
        align-self: center;
        font-size: 14px;
        transition: background .1s ease;
    }
    .widget-toggle:hover {
        background: #ddd;
    }

    .expanded {
        -webkit-line-clamp: unset;
        line-clamp: unset;
        overflow: visible;
    }

    @media screen and (max-width: 1040px) {
        .widget-testimonial {
            width: 400px;
            font-size: 14px;
        }
        .widget-toggle {
            font-size: 14px;
        }
        .widget-image {
            height: 13vh;
            width: 13vh;
        }
    }

    @media screen and (max-width: 450px) {
        .widget-preview {
            max-height: 50vh;
            padding: 4px 13px;
        }
        .widget-testimonial {
            width: 400px;
            font-size: 13px;
            padding: 8px 6px;
        }
        .widget-toggle {
            font-size: 13px;
        }

        .widget-image {
            height: 11vh;
            width: 11vh;
        }
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
            // const html = `
            //     <div class="widget-preview">
            //         <div class="user-info">
            //             <p class="name-preview"><strong>${data.name}</strong></p>
            //             <p class="business-preview">${data.business}</p>
            //         </div>
            //         <div class="testimonial-info">
            //             <p class="service-product"><strong>Service</strong>: ${data.service}</p>
            //             <div class="stars">${getStars(data.stars)}</div>
            //             <div class="testimonial">
            //                 <p class="myText">${data.testimonial}</p>
            //                 <button class="toggleButton">Show more</button>
            //             </div>
            //         </div>
            //     </div>
            // `;
            const html = `
                    <div class="widget-testimonial">
                        <div class="widget-user-info">
                            <img class="widget-image" src=${data.image} alt=""/>
                            <p class="widget-name"><strong>${data.name}</strong></p>
                            <p class="widget-business">${data.business}</p>
                        </div>
                        <div class="widget-testimonial-info">
                            <div class="widget-stars">${getStars(data.stars)}</div>
                            <p class="widget-service"><u>Service</u>: ${data.service}</p>
                            <div class="widget-testimonial-text">
                                <p class="widget-text">${data.testimonial}</p>
                                <div class="widget-toggle">Show more</div>
                            </div>
                        </div>
                    </div>
            `;
            container.querySelector('.widget-preview').innerHTML += html;

            document.querySelectorAll(".testimonial").forEach(testimonial => {
                const button = testimonial.querySelector(".widget-toggle");
                const text = testimonial.querySelector(".widget-text");

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

