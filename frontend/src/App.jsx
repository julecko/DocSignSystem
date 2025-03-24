import { Routes, Route } from 'react-router-dom';
import UploadPage from './Pages/UploadPage.jsx';
import SignPage from './Pages/SignPage.jsx';
import DocumentsPage from './Pages/DocumentsPage.jsx';
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