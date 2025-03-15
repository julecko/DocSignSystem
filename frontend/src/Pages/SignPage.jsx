import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'jq-signature';

function SignPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const signatureRef = useRef(null);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        // Fetch PDF
        axios
            .get(`http://localhost:8080/api/document/${id}`, { responseType: 'blob' })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setPdfUrl(url);
            })
            .catch((error) => console.error('Failed to fetch PDF:', error));

        if (signatureRef.current) {
            $(signatureRef.current).jqSignature({
                width: 300,
                height: 150,
                border: '1px solid black',
                background: '#FFFFFF',
                lineColor: '#000000',
                lineWidth: 2,
            });

            $(signatureRef.current).on('jq.signature.changed', () => {
                console.log('Signature changed');
            });
        }

        return () => {
            if (signatureRef.current) {
                $(signatureRef.current).jqSignature('clearCanvas');
            }
        };
    }, [id]);

    const handleSave = () => {
        if (signatureRef.current) {
            const signatureData = $(signatureRef.current).jqSignature('getDataURL');
            if (signatureData) {
                axios
                    .post(`http://localhost:8080/api/sign/${id}`, { signature: signatureData })
                    .then(() => {
                        alert('Document signed and saved!');
                        navigate('/');
                    })
                    .catch((error) => console.error('Save failed:', error));
            } else {
                alert('Please sign the document first!');
            }
        }
    };

    const handleClear = () => {
        if (signatureRef.current) {
            $(signatureRef.current).jqSignature('clearCanvas');
        }
    };

    return (
        <div>
            <h1>Sign Document</h1>
            {pdfUrl && <embed src={pdfUrl} width="500" height="600" type="application/pdf" />}
            <div
                ref={signatureRef}
                className="js-signature" // Optional: for consistency with docs
                style={{ border: '1px solid black', width: '300px', height: '150px' }}
            ></div>
            <button onClick={handleSave}>Save Signature</button>
            <button onClick={handleClear}>Clear Signature</button>
        </div>
    );
}

export default SignPage;