package com.businesscatalyzer.Service;

import com.businesscatalyzer.Model.Case;
import com.businesscatalyzer.Model.CaseStatus;
import com.businesscatalyzer.Model.Mood;
import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Repository.CaseRepository;
import com.businesscatalyzer.Repository.MessageRepository;
import com.businesscatalyzer.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private Map<String, Long> map;

    private boolean hasValidDate(Case c) {
        return c.getCreatedAt() != null;
    }

    private List<Case> filterByDays(List<Case> cases, int days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        return cases.stream()
                .filter(c -> c.getCreatedAt() != null)
                .filter(c -> c.getCreatedAt().isAfter(cutoff))
                .collect(Collectors.toList());
    }

    private boolean isPositive(Mood mood) {
        return mood == Mood.HAPPY
                || mood == Mood.APPRECIATION
                || mood == Mood.THANK_YOU;
    }

    private boolean isNegative(Mood mood) {
        return mood == Mood.ANGRY
                || mood == Mood.FRUSTRATED;
    }

    private boolean isNeutral(Mood mood) {
        return mood == Mood.NEUTRAL;
    }

    public Case createCase(Case caseData) {
        Long userId = caseData.getUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        caseData.setUser(user);
        caseData.setStatus(CaseStatus.OPEN);
        caseData.setCreatedAt(LocalDateTime.now());
        return caseRepository.save(caseData);
    }

    public List<Case> getUserCases(Long userId) {
        return caseRepository.findByUserId(userId);
    }

    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    public Case getCaseById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }

    public List<Case> getCasesByCompany(String companyName) {
        return caseRepository.findByCompanyName(companyName);
    }

    public Case save(Case caseData) {
        return caseRepository.save(caseData);
    }

    public Map<String, Object> getDashboard(String companyName, int days) {
        List<Case> cases = filterByDays(
                caseRepository.findByCompanyName(companyName),
                days
        );
        long total = cases.size();
        long closed = cases.stream()
                .filter(c -> c.getStatus() == CaseStatus.CLOSED)
                .count();
        long active = cases.stream()
                .filter(c -> c.getStatus() != CaseStatus.CLOSED)
                .count();
        long positive = cases.stream()
                .filter(c -> c.getMood() == Mood.HAPPY
                        || c.getMood() == Mood.APPRECIATION
                        || c.getMood() == Mood.THANK_YOU)
                .count();
        long negative = cases.stream()
                .filter(c -> c.getMood() == Mood.ANGRY
                        || c.getMood() == Mood.FRUSTRATED)
                .count();
        long neutral = cases.stream()
                .filter(c -> c.getMood() == Mood.NEUTRAL)
                .count();
        Map<String, Object> response = new HashMap<>();
        response.put("totalCases", total);
        response.put("activeCases", active);
        response.put("closedCases", closed);
        response.put("positiveCases", positive);
        response.put("negativeCases", negative);
        response.put("neutralCases", neutral);
        return response;
    }

    public Map<String, Map<String, Long>> getIncomingGraph(String companyName, int days) {
        List<Case> cases = filterByDays(
                caseRepository.findByCompanyName(companyName),
                days
        );
        if (days <= 7) {
            Map<LocalDate, Map<String, Long>> temp = cases.stream()
                    .filter(this::hasValidDate)
                    .collect(Collectors.groupingBy(
                            c -> c.getCreatedAt().toLocalDate(),
                            Collectors.collectingAndThen(Collectors.toList(), list -> {
                                Map<String, Long> map = new HashMap<>();
                                map.put("positive", list.stream().filter(x -> isPositive(x.getMood())).count());
                                map.put("negative", list.stream().filter(x -> isNegative(x.getMood())).count());
                                map.put("neutral", list.stream().filter(x -> isNeutral(x.getMood())).count());
                                return map;
                            })
                    ));
            Map<String, Map<String, Long>> result = new LinkedHashMap<>();
            temp.entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .forEach(entry -> {
                        String label = entry.getKey()
                                .getDayOfWeek()
                                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                                .toUpperCase();
                        result.put(label, entry.getValue());
                    });
            return result;
        }
        if (days <= 30) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");
            Map<LocalDate, Map<String, Long>> temp = cases.stream()
                    .filter(this::hasValidDate)
                    .collect(Collectors.groupingBy(
                            c -> c.getCreatedAt().toLocalDate(),
                            Collectors.collectingAndThen(Collectors.toList(), list -> {
                                Map<String, Long> map = new HashMap<>();
                                map.put("positive", list.stream().filter(x -> isPositive(x.getMood())).count());
                                map.put("negative", list.stream().filter(x -> isNegative(x.getMood())).count());
                                map.put("neutral", list.stream().filter(x -> isNeutral(x.getMood())).count());
                                return map;
                            })
                    ));
            Map<String, Map<String, Long>> result = new LinkedHashMap<>();
            temp.entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .forEach(entry -> {
                        String label = entry.getKey().format(formatter);
                        result.put(label, entry.getValue());
                    });
            return result;
        }
        Map<YearMonth, Map<String, Long>> temp = cases.stream()
                .filter(this::hasValidDate)
                .collect(Collectors.groupingBy(
                        c -> YearMonth.from(c.getCreatedAt()),
                        Collectors.collectingAndThen(Collectors.toList(), list -> {
                            Map<String, Long> map = new HashMap<>();
                            map.put("positive", list.stream().filter(x -> isPositive(x.getMood())).count());
                            map.put("negative", list.stream().filter(x -> isNegative(x.getMood())).count());
                            map.put("neutral", list.stream().filter(x -> isNeutral(x.getMood())).count());
                            return map;
                        })
                ));
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();
        temp.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    String label = entry.getKey()
                            .getMonth()
                            .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                            .toUpperCase();
                    result.put(label, entry.getValue());
                });
        return result;
    }

    public Map<String, Map<String, Long>> getWeeklyTrend(String companyName, int days) {

        List<Case> cases = filterByDays(
                caseRepository.findByCompanyName(companyName),
                days
        );

        Map<DayOfWeek, Map<String, Long>> temp = new EnumMap<>(DayOfWeek.class);

        // Initialize all days (Mon → Sun)
        for (DayOfWeek day : DayOfWeek.values()) {
            Map<String, Long> map = new HashMap<>();
            map.put("incoming", 0L);
            map.put("resolved", 0L);
            map.put("reopened", 0L);
            temp.put(day, map);
        }

        for (Case c : cases) {

            // ✅ Incoming → based on createdAt
            if (c.getCreatedAt() != null) {
                DayOfWeek day = c.getCreatedAt().getDayOfWeek();
                temp.get(day).put(
                        "incoming",
                        temp.get(day).get("incoming") + 1
                );
            }

            if (c.getResolvedAt() != null) {
                DayOfWeek day = c.getResolvedAt().getDayOfWeek();
                temp.get(day).put(
                        "resolved",
                        temp.get(day).get("resolved") + 1
                );
            }

            if (c.getReopenedAt() != null) {
                DayOfWeek day = c.getReopenedAt().getDayOfWeek();
                temp.get(day).put(
                        "reopened",
                        temp.get(day).get("reopened") + 1
                );
            }
        }

        Map<String, Map<String, Long>> result = new LinkedHashMap<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            result.put(day.toString(), temp.get(day));
        }

        return result;
    }

    public Map<String, Long> getResolutionGraph(String companyName,int days) {

        List<Case> cases = filterByDays(
                caseRepository.findByCompanyName(companyName),
                days
        );

        Map<String, Long> map = new HashMap<>();

        map.put("negative_to_positive", 0L);
        map.put("negative_to_negative", 0L);
        map.put("positive_to_positive", 0L);
        map.put("positive_to_negative", 0L);
        map.put("others", 0L);

        for (Case c : cases) {

            if (c.getResolvedMood() == null) continue;

            if (isNegative(c.getMood()) && isPositive(c.getResolvedMood())) {
                map.put("negative_to_positive", map.get("negative_to_positive") + 1);
            } else if (isNegative(c.getMood()) && isNegative(c.getResolvedMood())) {
                map.put("negative_to_negative", map.get("negative_to_negative") + 1);
            } else if (isPositive(c.getMood()) && isPositive(c.getResolvedMood())) {
                map.put("positive_to_positive", map.get("positive_to_positive") + 1);
            } else if (isPositive(c.getMood()) && isNegative(c.getResolvedMood())) {
                map.put("positive_to_negative", map.get("positive_to_negative") + 1);
            } else {
                map.put("others", map.get("others") + 1);
            }
        }

        return map;
    }


}