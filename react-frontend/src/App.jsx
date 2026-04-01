/**
 * App.jsx
 * Root component — sets up React Router with 3 pages.
 *   /           → Home
 *   /predictor  → Predictor (30-feature form)
 *   /about      → About the Dataset
 */
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predictor from './pages/Predictor';
import About from './pages/About';
import Workflow from './pages/Workflow';
import { warmUpAPI } from './utils/predictor';

export default function App() {
  // Ping the Render backend on load so it wakes from free-tier sleep
  useEffect(() => { warmUpAPI(); }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-mesh flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/about"     element={<About />} />
            <Route path="/workflow"  element={<Workflow />} />
            {/* Catch-all → Home */}
            <Route path="*"          element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
