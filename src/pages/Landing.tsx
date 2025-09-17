import deskwork from '../assets/deskwork.webp';
import './Landing.css';

type LandingProps = {
    setOuterView: (view: 'login' | 'signup' | 'export' | 'request' | null) => void;
}

// landing page, displayed when no user is signed in
function Landing({ setOuterView }: LandingProps) {
    
    return (
        <>
            <div className="headline-section">
                <h1>Easily Get Reviews From Your Customers and Clients!</h1>
                <h2>Sign up and have a review section on your site in just a few steps!</h2>

                <div className="headline-buttons">
                <div className="sign-up" onClick={() => setOuterView('signup')}>Free Sign Up</div>
                <p>or...</p>
                <div className="login" onClick={() => setOuterView('login')}>Log in</div>
                </div>
                <img src={deskwork} alt=""></img>
            </div>
            <div className="process-section">
                <h1>Never Waste Time Inputting Reviews Again!</h1>
                <p>"Review Service" makes collecting reviews and plugging them into your website fast and effortless.</p>
                <br/>
                <h2>Here's the simple process:</h2>
                <ol>
                    <li>Sign up and submit your <strong>business info</strong></li>
                    <li>Get a <strong>link to send to your clients/customers</strong>, where they will submit a review.</li>
                    <li>Those submitted reviews will <strong>appear on your dashboard</strong></li>
                    <li>Copy a <strong>widget to paste anywhere in your website html</strong>. It will display the reviews you have.</li>
                    <li><strong>Voila!</strong> The widget will <strong>update automatically</strong> as you get new reviews!</li>
                </ol>
            </div>
            <div className="cta-section">
                <br/>
                <br/>
                <br/>
                <div className="last-cta">
                    <h1>What Are You Waiting For? Click The Signup Button!</h1>
                    <div className="sign-up" onClick={() => setOuterView('signup')}>Free Sign Up</div>
                </div>
            </div>
        </>
    )
}

export default Landing;