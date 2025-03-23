package sk.dilino.docsignsystem.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class User {
    @Id
    private String birthNumber;

    private String name;
    private String email;
    private String phone;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();

    public User() {}

    public User(String birthNumber, String name, String email, String phone) {
        this.birthNumber = birthNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public String getBirthNumber() { return birthNumber; }
    public void setBirthNumber(String birthNumber) { this.birthNumber = birthNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }
}