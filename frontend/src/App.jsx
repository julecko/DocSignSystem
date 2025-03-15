import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import SignPage from './pages/SignPage';
import DocumentsPage from './pages/DocumentsPage';

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/sign/:id" element={<SignPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
            </Routes>
        </div>
    );
}

export default App;