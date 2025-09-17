import { useState, useRef, useEffect } from 'react';
import { auth } from '../services/firebase.js';
import { signOut } from 'firebase/auth';
import authIcon from '../assets/auth-icon.png';
import './Header.css';

type HeaderProps = {
    setOuterView: (view: 'login' | 'signup' | 'export' | 'request' | null) => void;
}

// displayed when a user is logged in
function DashboardHeader({ setOuterView }: HeaderProps ) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleTitleClick = () => {
        window.location.href = "/";
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const logout = () => {
        try {
            signOut(auth);
        } catch(err:any) {
            console.error(err.message);
            alert(err.message);
        }
    }

    // handle clicks outside the dropdown when the dropown is being displayed
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header>
            <h2 onClick={handleTitleClick}>
                Review Service
            </h2>
            <div className="header-items">
                <p className="to-export" onClick={() => setOuterView('export')}>
                    Export Reviews
                </p>
                <p className="to-request" onClick={() => setOuterView('request')}>
                    Request Review
                </p>

                <img src={authIcon} 
                    onClick={toggleDropdown}
                    className="dropdown-icon" 
                    alt="login icon"
                />

                { dropdownOpen && (
                    <div className="dropdown" ref={dropdownRef}>
                        <div className="drop-logout" onClick={logout}>
                            Log out
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default DashboardHeader;