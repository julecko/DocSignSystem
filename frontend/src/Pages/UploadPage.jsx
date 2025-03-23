import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/main.scss';

function UploadPage() {
    const [file, setFile] = useState(null);
    const [birthNumber, setBirthNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [userExists, setUserExists] = useState(false);
    const [birthNumberError, setBirthNumberError] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const birthNumberRegex = /^[0-9]{6}(\/?[0-9]{3,4})?$/;

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (birthNumber) {
                if (!/^[0-9/]*$/.test(birthNumber)) {
                    setBirthNumberError('Birth number can only contain digits and an optional slash');
                    setSearchResults([]);
                    setUserExists(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    return;
                }
                if (birthNumber.length >= 2) {
                    searchUsers(birthNumber);
                } else {
                    setSearchResults([]);
                }
                if (birthNumberRegex.test(birthNumber)) {
                    setBirthNumberError('');
                    checkExactBirthNumber(birthNumber);
                } else {
                    setBirthNumberError('Invalid format (e.g., YYMMDD/XXXX)');
                    setUserExists(false);
                }
            } else {
                setSearchResults([]);
                setBirthNumberError('');
                setUserExists(false);
                setName('');
                setEmail('');
                setPhone('');
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [birthNumber]);

    const searchUsers = async (prefix) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/search?prefix=${prefix}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        }
    };

    const checkExactBirthNumber = async (value) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/${value}`);
            if (response.status === 200) {
                const user = response.data;
                setUserExists(true);
                setName(user.name || '');
                setEmail(user.email || '');
                setPhone(user.phone || '');
                setSearchResults([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setUserExists(false);
                setName('');
                setEmail('');
                setPhone('');
            }
        }
    };

    const handleBirthNumberChange = (e) => {
        setBirthNumber(e.target.value);
    };

    const handleResultClick = (user) => {
        setBirthNumber(user.birthNumber);
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setUserExists(true);
        setSearchResults([]);
        setBirthNumberError('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !birthNumber) {
            alert('Please provide a file and birth number.');
            return;
        }
        if (birthNumberError) {
            alert('Please fix the birth number error before submitting.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('birthNumber', birthNumber);
        if (!userExists) {
            if (name) formData.append('name', name);
            if (email) formData.append('email', email);
            if (phone) formData.append('phone', phone);
        }
        try {
            const response = await axios.post('http://localhost:8080/api/upload', formData);
            navigate(`/sign/${response.data}`);
        } catch (error) {
            console.error('Upload failed', error);
        }
    };

    return (
        <div className="upload-page">
            <h1>Upload Document</h1>
            <form className="upload-form" onSubmit={handleUpload}>
                <div className="form-group birth-number-group">
                    <label htmlFor="birthNumber">Birth Number</label>
                    <input
                        type="text"
                        id="birthNumber"
                        value={birthNumber}
                        onChange={handleBirthNumberChange}
                        placeholder="e.g., 990101/1234"
                        required
                        className={birthNumberError ? 'input-error' : ''}
                    />
                    {birthNumberError && <span className="error-message">{birthNumberError}</span>}
                    {searchResults.length > 0 && (
                        <ul className="search-results">
                            {searchResults.map((user) => (
                                <li
                                    key={user.birthNumber}
                                    onClick={() => handleResultClick(user)}
                                    className="search-result-item"
                                >
                                    {user.birthNumber} {user.name ? `- ${user.name}` : ''}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="form-row">
                    {!userExists ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Full Name (Optional)</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email (Optional)</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group disabled-fields full-width">
                            <label>Full Name</label>
                            <input type="text" value={name} disabled />
                            <label>Email</label>
                            <input type="email" value={email} disabled />
                            <label>Phone</label>
                            <input type="tel" value={phone} disabled />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="file">Document (PDF)</label>
                    <input
                        type="file"
                        id="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" disabled={!file || !birthNumber || birthNumberError}>
                    Upload and Proceed to Sign
                </button>
            </form>
        </div>
    );
}

export default UploadPage;