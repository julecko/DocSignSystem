import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import SignPage from './pages/SignPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilesPage from "./Pages/ProfilesPage.jsx";
import Header from "./Components/Header.jsx";

function App() {
    return (
        <div className="container">
            <Header />
            <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/sign/:id" element={<SignPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/profiles" element={<ProfilesPage />} />
            </Routes>
        </div>
    );
}

export default App;