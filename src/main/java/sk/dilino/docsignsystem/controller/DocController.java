package sk.dilino.docsignsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sk.dilino.docsignsystem.entity.Document;
import sk.dilino.docsignsystem.repository.DocumentRepository;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class DocController {

    @Autowired
    private DocumentRepository docRepo;

    @PostMapping("/upload")
    public ResponseEntity<Long> uploadDocument(@RequestParam("file") MultipartFile file) throws IOException {
        Document doc = new Document();
        doc.setPdfData(file.getBytes());
        Document savedDoc = docRepo.save(doc);
        return ResponseEntity.ok(savedDoc.getId());
    }

    @GetMapping("/document/{id}")
    public ResponseEntity<byte[]> getDocument(@PathVariable Long id) {
        Document doc = docRepo.findById(id).orElseThrow();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(doc.getPdfData());
    }

    @PostMapping("/sign/{id}")
    public ResponseEntity<String> signDocument(@PathVariable Long id, @RequestBody String signatureBase64) {
        Document doc = docRepo.findById(id).orElseThrow();
        doc.setSignature(signatureBase64.getBytes()); // Store as bytes; adjust if needed
        docRepo.save(doc);
        return ResponseEntity.ok("Document signed and saved");
    }
}