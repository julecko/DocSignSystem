package sk.dilino.docsignsystem.entity;

import jakarta.persistence.*;

@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    private byte[] content;

    @Lob
    private String signature;

    // Constructors
    public Document() {}

    public Document(String name, byte[] content) {
        this.name = name;
        this.content = content;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public byte[] getContent() { return content; }
    public void setContent(byte[] content) { this.content = content; }

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
}