package sk.dilino.docsignsystem.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "birth_number")
    @JsonBackReference
    private User user;

    private String name;

    @Lob
    private byte[] content;

    public Document() {}

    public Document(String name, byte[] content, User user) {
        this.name = name;
        this.content = content;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public byte[] getContent() { return content; }
    public void setContent(byte[] content) { this.content = content; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }
}