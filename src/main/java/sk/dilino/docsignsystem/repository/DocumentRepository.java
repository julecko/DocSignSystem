package sk.dilino.docsignsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.dilino.docsignsystem.entity.Document;
import sk.dilino.docsignsystem.entity.User;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUser(User user);
}