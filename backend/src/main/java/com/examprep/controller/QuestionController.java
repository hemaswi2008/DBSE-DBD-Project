package com.examprep.controller;

import com.examprep.entity.Question;
import com.examprep.repository.QuestionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @GetMapping("/subject/{subjectName}")
    public List<Question> getQuestionsBySubjectName(@PathVariable String subjectName,
                                                  @RequestParam(required = false) String difficulty,
                                                  @RequestParam(required = false) String excludeIds) {
        String normalizedDifficulty = difficulty == null || difficulty.isBlank()
                ? null
                : difficulty.trim().toUpperCase(Locale.ROOT);

        List<Question> questions = (normalizedDifficulty == null)
                ? questionRepository.findBySubjectName(subjectName)
                : questionRepository.findBySubjectNameAndDifficulty(subjectName, normalizedDifficulty);

        Set<Integer> excluded = new HashSet<>();
        if (excludeIds != null && !excludeIds.isBlank()) {
            String[] parts = excludeIds.split(",");
            for (String part : parts) {
                String cleaned = part.trim();
                if (!cleaned.isEmpty()) {
                    try {
                        excluded.add(Integer.parseInt(cleaned));
                    } catch (NumberFormatException ignored) {
                        // Ignore invalid values and keep the rest of the questions.
                    }
                }
            }
        }

        Map<String, Question> uniqueQuestions = new LinkedHashMap<>();
        for (Question question : questions) {
            String canonicalText = canonicalizeQuestionText(question.getQuestionText());
            Question existing = uniqueQuestions.get(canonicalText);
            if (existing == null || isPreferredQuestion(question, existing)) {
                uniqueQuestions.put(canonicalText, question);
            }
        }

        List<Question> shuffled = new ArrayList<>(uniqueQuestions.values());
        if (!excluded.isEmpty()) {
            shuffled.removeIf(question -> excluded.contains(question.getQuestionId()));
        }
        Collections.shuffle(shuffled);
        return shuffled;
    }

    private String canonicalizeQuestionText(String questionText) {
        return questionText
                .replaceAll("(?i)\\s*[-–—:]?\\s*(?:practice\\s+)?variant\\s+\\d+\\s*$", "")
                .trim()
                .replaceAll("\\s+", " ")
                .toLowerCase(Locale.ROOT);
    }

    private boolean isPreferredQuestion(Question candidate, Question existing) {
        boolean candidateIsVariant = candidate.getQuestionText()
                .matches("(?is).*[-–—:]?\\s*(?:practice\\s+)?variant\\s+\\d+\\s*$");
        boolean existingIsVariant = existing.getQuestionText()
                .matches("(?is).*[-–—:]?\\s*(?:practice\\s+)?variant\\s+\\d+\\s*$");
        if (candidateIsVariant != existingIsVariant) {
            return !candidateIsVariant;
        }
        return candidate.getQuestionId() < existing.getQuestionId();
    }
}
