import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import SignPage from './pages/SignPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/sign/:id" element={<SignPage />} />
            </Routes>
        </Router>
    );
}

export default App;