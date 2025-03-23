import { useEffect, useState } from 'react';
import axios from 'axios';

function DocumentsPage() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/documents')
            .then((response) => {
                const docs = response.data;
                Promise.all(
                    docs.map((doc) =>
                        axios
                            .get(`http://localhost:8080/api/document/${doc.id}`, { responseType: 'blob' })
                            .then((pdfResponse) => ({
                                ...doc,
                                pdfBlobUrl: URL.createObjectURL(pdfResponse.data),
                            }))
                    )
                )
                    .then((updatedDocs) => setDocuments(updatedDocs))
                    .catch((error) => console.error('Failed to fetch PDFs:', error));
            })
            .catch((error) => console.error('Failed to fetch documents:', error));

        return () => {
            documents.forEach((doc) => {
                if (doc.pdfBlobUrl) URL.revokeObjectURL(doc.pdfBlobUrl);
            });
        };
    }, []);

    const handleDownload = (id) => {
        axios
            .get(`http://localhost:8080/api/download/${id}`, { responseType: 'blob' })
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
            <h1>All Documents</h1>
            <div className="documents-list">
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <div key={doc.id} className="document-item">
                            <div className="document-title">{doc.name || `Document ${doc.id}`}</div>
                            {doc.pdfBlobUrl && (
                                <embed
                                    src={doc.pdfBlobUrl}
                                    type="application/pdf"
                                    className="pdf-preview"
                                />
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