package sk.dilino.docsignsystem.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import sk.dilino.docsignsystem.entity.Document;
import sk.dilino.docsignsystem.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DocController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<Long> uploadDocument(@RequestParam("file") MultipartFile file) {
        Long id = documentService.saveDocument(file);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/document/{id}")
    public ResponseEntity<byte[]> getDocument(@PathVariable Long id) {
        byte[] content = documentService.getDocumentContent(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(content);
    }

    @PostMapping("/sign/{id}")
    public ResponseEntity<Void> signDocument(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String signature = payload.get("signature");
        documentService.signDocument(id, signature);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadCombined(@PathVariable Long id) {
        byte[] combinedPdf = documentService.getCombinedPdf(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document_" + id + "_signed.pdf\"")
                .body(new ByteArrayResource(combinedPdf));
    }
}