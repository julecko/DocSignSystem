package sk.dilino.docsignsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.dilino.docsignsystem.entity.User;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {
    List<User> findByBirthNumberStartingWith(String prefix);
}