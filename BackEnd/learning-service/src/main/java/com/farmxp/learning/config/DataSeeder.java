package com.farmxp.learning.config;

import com.farmxp.learning.entity.Game;
import com.farmxp.learning.entity.Module;
import com.farmxp.learning.entity.Question;
import com.farmxp.learning.enums.GameType;
import com.farmxp.learning.repository.GameRepository;
import com.farmxp.learning.repository.ModuleRepository;
import com.farmxp.learning.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(
            ModuleRepository moduleRepository,
            GameRepository gameRepository,
            QuestionRepository questionRepository) {

        return args -> {
            // Find module 21 (Assuming its ID is 21 or search by title if needed)
            moduleRepository.findById(21L).ifPresent(module -> {
                List<Game> games = gameRepository.findByModuleModuleIdOrderByDisplayOrderAsc(21L);
                if (games.isEmpty()) {
                    // Create a Game for Module 21
                    Game game = new Game();
                    game.setModule(module);
                    game.setTitle("Module 21 Quiz");
                    game.setDescription("Test your knowledge on Module 21.");
                    game.setGameType(GameType.QUIZ);
                    game.setPassingScore(70);
                    game.setDisplayOrder(1);
                    game = gameRepository.save(game);

                    // Create some questions
                    Question q1 = new Question();
                    q1.setGame(game);
                    q1.setQuestionText("What is the primary benefit of crop rotation?");
                    q1.setOptionA("Increases soil erosion");
                    q1.setOptionB("Improves soil health and fertility");
                    q1.setOptionC("Reduces crop yield");
                    q1.setOptionD("Requires more chemical fertilizers");
                    q1.setCorrectOption("B");
                    q1.setMarks(50);

                    Question q2 = new Question();
                    q2.setGame(game);
                    q2.setQuestionText("Which irrigation method is most water-efficient?");
                    q2.setOptionA("Flood irrigation");
                    q2.setOptionB("Sprinkler irrigation");
                    q2.setOptionC("Drip irrigation");
                    q2.setOptionD("Manual watering");
                    q2.setCorrectOption("C");
                    q2.setMarks(50);

                    questionRepository.saveAll(List.of(q1, q2));
                    System.out.println("Seeded Game and Questions for Module 21");
                }
            });
        };
    }
}
