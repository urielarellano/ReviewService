import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from "./services/firebase";
import { onAuthStateChanged } from 'firebase/auth';

import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import Outer from './components/Outer';
import DashboardOuter from './components/DashboardOuter';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SubmitReview from './pages/SubmitReview';

import './App.css'

function App() {
  // variable to see if user is logged in
  const [userLogged, setUserLogged] = useState<boolean>(false);
  // check if the modal window should be displayed, and which one
  const [view, setView] = useState<'login' | 'signup' | 'export' | 'request' | null>(null);

  // set userLogged on auth change
  useEffect (() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUserLogged(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      { userLogged ? <DashboardHeader setOuterView={setView}/> : <Header setOuterView={setView}/> }
      <Outer view={view} setOuterView={setView} />

      <Router>
        <DashboardOuter view={view} setOuterView={setView} />
        <Routes>
          <Route path="/" element={userLogged ? <Dashboard /> : <Landing setOuterView={setView}/>}/>
          <Route path="/request-review/:num" element={<SubmitReview />}/>
        </Routes>
      </Router>

      <footer>
        <p>Uriel Arellano Sandoval</p>
        <a href="https://urielarellano.github.io/uriel-portfolio/" target="_blank" rel="noopener noreferrer">My website/portfolio</a>
        <a href="https://www.flaticon.com/free-icons/login" title="login icons" target="_blank" rel="noopener noreferrer">Login icons created by Freepik - Flaticon</a>
      </footer>
    </>
  )
}

export default App
