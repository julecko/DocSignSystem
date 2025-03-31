import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/main.scss';

function ProfilesPage() {
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('/api/users/search?prefix=');
                setProfiles(response.data);
            } catch (error) {
                console.error('Failed to fetch profiles:', error);
            }
        };
        fetchProfiles();
    }, []);

    const handleRowClick = (birthNumber) => {
        navigate(`/documents?birthNumber=${birthNumber}`);
    };

    return (
        <div className="profiles-page">
            <h1>User Profiles</h1>
            <div className="profiles-table-container">
                <table className="profiles-table">
                    <thead>
                    <tr>
                        <th>Birth Number</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {profiles.map((profile) => (
                        <tr
                            key={profile.birthNumber}
                            onClick={() => handleRowClick(profile.birthNumber)}
                            className="profile-row"
                        >
                            <td>{profile.birthNumber}</td>
                            <td>{profile.name || '-'}</td>
                            <td>{profile.email || '-'}</td>
                            <td>{profile.phone || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProfilesPage;