package com.businesscatalyzer.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String companyName;
    private String gst;
    private String state;
    private String district;
    private String pincode;
    private String companyType;

    @Column(length = 2000)
    private String complaint;

    private String notes;

    @Enumerated(EnumType.STRING)
    private Mood mood;

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageBase64;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private Mood resolvedMood;

    private LocalDateTime resolvedAt;
    private LocalDateTime reopenedAt;
}