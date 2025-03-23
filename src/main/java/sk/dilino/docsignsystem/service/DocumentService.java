package sk.dilino.docsignsystem.service;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import sk.dilino.docsignsystem.entity.Document;
import sk.dilino.docsignsystem.entity.User;
import sk.dilino.docsignsystem.repository.DocumentRepository;
import sk.dilino.docsignsystem.repository.UserRepository;
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
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    public Long saveDocument(MultipartFile file, String birthNumber, String name, String email, String phone, String originalFileName) {
        try {
            User user = userRepository.findById(birthNumber)
                    .orElseGet(() -> {
                        User newUser = new User(birthNumber, name, email, phone);
                        return userRepository.save(newUser);
                    });

            String documentName = birthNumber + "-" + originalFileName;
            Document document = new Document(documentName, file.getBytes(), user);
            return documentRepository.save(document).getId();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save document: " + e.getMessage());
        }
    }

    public Document getDocument(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public byte[] getDocumentContent(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        return document.getContent();
    }

    public void signDocument(Long id, String signature) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        try {
            PdfReader reader = new PdfReader(document.getContent());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfStamper stamper = new PdfStamper(reader, baos);

            int pageCount = reader.getNumberOfPages();
            PdfContentByte content = stamper.getOverContent(pageCount);
            byte[] signatureBytes = Base64.getDecoder().decode(signature.split(",")[1]);
            Image signatureImage = Image.getInstance(signatureBytes);
            signatureImage.scaleToFit(150, 50);
            signatureImage.setAbsolutePosition(50, 50);
            content.addImage(signatureImage);

            stamper.close();
            reader.close();

            document.setContent(baos.toByteArray());
            documentRepository.save(document);
        } catch (IOException | DocumentException e) {
            throw new RuntimeException("Failed to sign document", e);
        }
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public User getUserByBirthNumber(String birthNumber) {
        return userRepository.findById(birthNumber).orElse(null);
    }

    public List<User> searchUsersByBirthNumberPrefix(String prefix) {
        return userRepository.findByBirthNumberStartingWith(prefix);
    }
}