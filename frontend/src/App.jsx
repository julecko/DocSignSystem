import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SignDocument from './pages/SignDocument';
import ViewDocuments from './pages/ViewDocuments';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign" element={<SignDocument />} />
                    <Route path="/documents" element={<ViewDocuments />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;