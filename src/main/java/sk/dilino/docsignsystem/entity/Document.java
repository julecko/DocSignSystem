package sk.dilino.docsignsystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob // For storing large binary data (PDF)
    private byte[] pdfData;

    @Lob // For storing signature as base64 or binary
    private byte[] signature;

    public Document() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public byte[] getPdfData() { return pdfData; }
    public void setPdfData(byte[] pdfData) { this.pdfData = pdfData; }
    public byte[] getSignature() { return signature; }
    public void setSignature(byte[] signature) { this.signature = signature; }
}