package sk.dilino.docsignsystem.service;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import sk.dilino.docsignsystem.entity.Document;
import sk.dilino.docsignsystem.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository repository;

    public Long saveDocument(MultipartFile file) {
        try {
            Document document = new Document(file.getOriginalFilename(), file.getBytes());
            return repository.save(document).getId();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save document: " + e.getMessage());
        }
    }

    public Document getDocument(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public byte[] getDocumentContent(Long id) {
        Document document = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return document.getContent();
    }

    public void signDocument(Long id, String signature) {
        Document document = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setSignature(signature);
        repository.save(document);
    }

    public List<Document> getAllDocuments() {
        return repository.findAll();
    }

    public byte[] getCombinedPdf(Long id) {
        Document doc = getDocument(id);
        try {
            PdfReader reader = new PdfReader(doc.getContent());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfStamper stamper = new PdfStamper(reader, baos);

            // Add signature image to the last page
            int pageCount = reader.getNumberOfPages();
            PdfContentByte content = stamper.getOverContent(pageCount);
            byte[] signatureBytes = Base64.getDecoder().decode(doc.getSignature().split(",")[1]);
            Image signatureImage = Image.getInstance(signatureBytes);
            signatureImage.scaleToFit(150, 50); // Adjust size as needed
            signatureImage.setAbsolutePosition(50, 50); // Bottom-left corner
            content.addImage(signatureImage);

            stamper.close();
            reader.close();
            return baos.toByteArray();
        } catch (IOException | DocumentException e) {
            throw new RuntimeException("Failed to combine PDF and signature", e);
        }
    }
}