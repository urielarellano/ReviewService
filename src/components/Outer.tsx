import { db, auth } from '../services/firebase.js';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './Outer.css';

type OuterProps = {
    view: 'login' | 'signup' | 'export' | 'request' | null;
    setOuterView: (view: 'login' | 'signup' | 'export' | 'request' | null) => void;
}

// 'outer' element (the modal) contents when no user is signed in
function Outer({ view, setOuterView }: OuterProps) {

    const signupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const firstName = (form.elements.namedItem("signup-first-name") as HTMLInputElement).value;
        const bizName = (form.elements.namedItem("signup-biz-name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("signup-email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("signup-password") as HTMLInputElement).value;

        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;
            await setDoc(doc(db, "users", uid), { name: firstName, business: bizName, email });
            console.log("User signed up!");
        } catch (err: any) {
            console.error(err.message);
            alert(err.message);
        }
    };

    const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('user signed in');
        } catch (err: any) {
            console.error(err.message);
            alert(err.message);
        }
    }

    if (view !== 'login' && view !== 'signup') {
        return (<></>);
    }

    return (
        <div className="outer"
            style={{ display: view ? 'flex' : 'none' }}
            onClick={() => setOuterView(null)}>

            {view === 'signup' && 
                <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="close-modal">
                        <p className="close-modal-button" onClick={() => setOuterView(null)}>&#10006;</p>
                    </div>
                    <h2>Sign Up</h2>
                    <form id="signup-form" 
                        onSubmit={(e) => {
                            e.preventDefault();
                            signupSubmit(e); 
                            setOuterView(null); 
                        }}>
                        <input type="text" name="signup-first-name" placeholder="Your First Name" required/>
                        <input type="text" name="signup-biz-name" placeholder="Your Business Name" required/>
                        <input type="email" name="signup-email" placeholder="Email" required/>
                        <input type="password" name="signup-password" placeholder="Password" required/>
                        <input className="submit-button" name="signup-submit" type="submit" value="Sign Up"/>
                    </form>
                    <br/>
                    <p>Already have an account?</p>
                    <div className="login" 
                        onClick={() => setOuterView('login')}
                        style={{animation: 'none'}}>
                            Log in
                    </div>
                </div>
            }

            { view === 'login' &&
                <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="close-modal">
                        <p className="close-modal-button" onClick={() => setOuterView(null)}>&#10006;</p>
                    </div>
                    <h2>Log In</h2>
                    <form id="login-form" 
                        onSubmit={(e) => {
                            e.preventDefault();
                            loginSubmit(e); 
                            setOuterView(null); 
                            }}>
                        <input type="email" name="email" placeholder="Email"/>
                        <input type="password" name="password" placeholder="Password"/>
                        <input className="login-button" type="submit" value="Log in"/>
                    </form>
                    <p>No account yet?</p>
                    <div className="sign-up" 
                        onClick={() => setOuterView('signup')}>
                            Sign Up
                    </div>
                </div>
            }

        </div>
    )
}

export default Outer;