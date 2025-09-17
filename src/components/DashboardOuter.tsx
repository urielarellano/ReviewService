import { useState, useEffect, useRef } from 'react';
import type { RefObject } from "react";

import { auth } from "../services/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import Testimonial from './Testimonial';
import floria from '../assets/floria-elizabeth.png';
import './Outer.css';


type OuterProps = {
    view: 'login' | 'signup' | 'export' | 'request' | null;
    setOuterView: (view: 'login' | 'signup' | 'export' | 'request' | null) => void;
}

// 'outer' element (the modal) contents when user is signed in
function DashboardOuter({ view, setOuterView }: OuterProps) {
    const [uid, setUid] = useState<string>('');
    const [requestUrl, setRequestUrl] = useState<string>('');
    const embedCopyRef = useRef<HTMLDivElement | null>(null);
    const requestCopyRef = useRef<HTMLDivElement | null>(null);
    const location = window.location.href;

    // set requestUrl and uid
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                setRequestUrl(`${location}request-review/${user.uid}`);
            }
        });
        return () => unsubscribe(); // cleanup when component unmounts
    }, []);

    // copy text helper function
    const copyText = async (text: string, ref: RefObject<HTMLDivElement | null>): Promise<void> => {
        await navigator.clipboard.writeText(text);

        if (ref.current) {
            const originalText = ref.current.textContent;
            ref.current.textContent = 'copied!';

            setTimeout(() => {
                ref.current!.textContent = originalText;
            }, 1400);
        }
    }

    // copy export reviews embed
    const copyEmbed = async () => {
        try {
            await copyText(
                `<div id="reviewservice"></div>
        <script src="${location}embed.js" data-id="${uid}"></script>`, 
                embedCopyRef
            );
        } catch (err) {
            console.error("Failed to copy text", err);
        }
    };

    // copy request url
    const copyRequest = async () => {
        try {
            await copyText(requestUrl, requestCopyRef);
        } catch (err) {
            console.error("Failed to copy text", err);
        }
    }

    if (view !== 'export' && view !== 'request') {
        return (<></>);
    }

    
    return (
        <div className="outer"
            style={{ display: view ? 'flex' : 'none' }}
            onClick={() => setOuterView(null)}
        >
            {view === 'export' && (
                <div className="export-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="close-modal">
                        <p className="close-modal-button" onClick={() => setOuterView(null)}>&#10006;</p>
                    </div>
                    <h3>Review Preview:</h3>
                    <Testimonial
                        image={floria}
                        name="Floria Elizabeth"
                        business="Floria Flowers"
                        service="Marketing Funnel Optimization"
                        stars={5}
                        text="I cannot say enough good things about Arellano Advertising! They helped my flower business go from a smaller local store to a well-known regional flower business. The results spoke for themselves and the sales they produced more than justified the price. Highly recommended!"
                    />
                    
                    <h3>Embed this code on your site:</h3>
                    <div className="code-embed">
                        <div className="copy-button" 
                            onClick={copyEmbed}
                            ref={embedCopyRef}>
                            copy
                        </div>
                        <pre>
                            <code>
                                {`<div id="reviewservice"></div>
<script src="${location}embed.js" data-id="${uid}"></script>`}
                            </code>
                        </pre>
                    </div>
                </div>
            )}
            
            {view === 'request' && (
                <div className="request-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="close-modal">
                        <p className="close-modal-button" onClick={() => setOuterView(null)}>&#10006;</p>
                    </div>
                    <h2>Send this link to your client/customer to have them fill out a review! &#10552;</h2>
                    <div className="review-link">
                        <div className="link-copy-button"
                            onClick={copyRequest} 
                            ref={requestCopyRef}>
                            copy
                        </div>
                        <p>{requestUrl}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardOuter;