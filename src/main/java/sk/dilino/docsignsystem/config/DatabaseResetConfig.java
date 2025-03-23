package sk.dilino.docsignsystem.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;

@Configuration
public class DatabaseResetConfig {

    @Autowired
    private Flyway flyway;

    @Bean
    @Profile("dev")
    @Order(1)
    public CommandLineRunner resetDatabase() {
        return args -> {
            System.out.println("Resetting database in dev mode...");
            flyway.clean();
            flyway.migrate();
            System.out.println("Database reset and migrations reapplied.");
        };
    }
}