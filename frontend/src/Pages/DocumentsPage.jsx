import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/main.scss';

function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [searchParams] = useSearchParams();
    const birthNumber = searchParams.get('birthNumber');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const url = birthNumber
                    ? `/api/documents?birthNumber=${birthNumber}`
                    : '/api/documents';
                const response = await axios.get(url);
                const docs = response.data;

                const updatedDocs = await Promise.all(
                    docs.map((doc) =>
                        axios
                            .get(`/api/document/${doc.id}`, { responseType: 'blob' })
                            .then((pdfResponse) => ({
                                ...doc,
                                pdfBlobUrl: URL.createObjectURL(pdfResponse.data),
                            }))
                            .catch((error) => {
                                console.error(`Failed to fetch PDF for doc ${doc.id}:`, error);
                                return { ...doc, pdfBlobUrl: null };
                            })
                    )
                );
                setDocuments(updatedDocs);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };

        fetchDocuments();

        return () => {
            documents.forEach((doc) => {
                if (doc.pdfBlobUrl) URL.revokeObjectURL(doc.pdfBlobUrl);
            });
        };
    }, [birthNumber]); // Re-run when birthNumber changes

    const handleDownload = (id) => {
        axios
            .get(`/api/download/${id}`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `document_${id}_signed.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            })
            .catch((error) => console.error('Download failed:', error));
    };

    return (
        <div className="documents-page">
            <h1>{birthNumber ? `Documents for ${birthNumber}` : 'All Documents'}</h1>
            <div className="documents-list">
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <div key={doc.id} className="document-item">
                            <div className="document-title">{doc.name || `Document ${doc.id}`}</div>
                            {doc.pdfBlobUrl ? (
                                <embed
                                    src={doc.pdfBlobUrl}
                                    type="application/pdf"
                                    className="pdf-preview"
                                />
                            ) : (
                                <p className="pdf-error">PDF unavailable</p>
                            )}
                            <button onClick={() => handleDownload(doc.id)}>Download</button>
                        </div>
                    ))
                ) : (
                    <p>No documents available.</p>
                )}
            </div>
        </div>
    );
}

export default DocumentsPage;