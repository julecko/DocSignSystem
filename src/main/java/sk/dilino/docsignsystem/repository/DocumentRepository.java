package sk.dilino.docsignsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.dilino.docsignsystem.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}