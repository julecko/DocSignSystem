package sk.dilino.docsignsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import sk.dilino.docsignsystem.entity.Document;
import sk.dilino.docsignsystem.entity.User;
import sk.dilino.docsignsystem.repository.DocumentRepository;
import sk.dilino.docsignsystem.repository.UserRepository;

import java.util.Random;

@Configuration
public class DatabaseSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Bean
    @Profile("dev")
    public CommandLineRunner seedDatabase() {
        return args -> {
            System.out.println("Seeding database with initial data in dev mode...");

            Random random = new Random();

            if (userRepository.count() == 0) {
                User user1 = new User("9901011234", "John Doe", "john.doe@example.com", "123-456-7890");
                User user2 = new User("8802025678", "Jane Smith", "jane.smith@example.com", "098-765-4321");
                User user3 = new User("7703039012", "Alice Johnson", "alice.johnson@example.com", "555-123-4567");
                User user4 = new User("6604043456", "Bob Brown", "bob.brown@example.com", "444-987-6543");

                userRepository.save(user1);
                userRepository.save(user2);
                userRepository.save(user3);
                userRepository.save(user4);

                System.out.println("Seeded " + userRepository.count() + " users.");
            } else {
                System.out.println("Users already exist, skipping user seeding.");
            }

            if (documentRepository.count() == 0) {
                String[] docNames = {
                        "contract.pdf", "agreement.pdf", "invoice.pdf",
                        "report.pdf", "certificate.pdf"
                };

                Iterable<User> users = userRepository.findAll();

                for (User user : users) {
                    int docCount = random.nextInt(5) + 1;
                    for (int i = 0; i < docCount; i++) {
                        String docName = user.getBirthNumber() + "-" + docNames[i % docNames.length];
                        String content = "Sample content for " + docName;
                        Document document = new Document(docName, content.getBytes(), user);
                        documentRepository.save(document);
                    }
                    System.out.println("Seeded " + docCount + " documents for user " + user.getBirthNumber());
                }

                System.out.println("Total seeded documents: " + documentRepository.count());
            } else {
                System.out.println("Documents already exist, skipping document seeding.");
            }

            System.out.println("Database seeding completed.");
        };
    }
}