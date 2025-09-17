import { useState, useEffect, useRef } from "react";
import authIcon from '../assets/auth-icon.png';

import './Header.css';

type HeaderProps = {
    setOuterView: (view: 'login' | 'signup' | 'export' | 'request' | null) => void;
}


// displayed when no user is logged in
function Header({ setOuterView }: HeaderProps ) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleTitleClick = () => {
        window.location.href = "/";
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

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
        <>
            <header>
                <h2 onClick={handleTitleClick}>
                    Review Service
                </h2>

                <img 
                    src={authIcon} 
                    onClick={toggleDropdown}
                    className="dropdown-icon" 
                    alt="login icon"
                />
                {dropdownOpen && (
                    <div className="dropdown" ref={dropdownRef}>
                        <div className="sign-up drop-signup" onClick={() => setOuterView('signup')}>
                            Sign up
                        </div>
                        <div className="login drop-log-in" onClick={() => setOuterView('login')}>
                            Log in
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}

export default Header;