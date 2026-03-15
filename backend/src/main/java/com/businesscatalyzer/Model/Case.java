package com.businesscatalyzer.Model;

import jakarta.persistence.*;
import lombok.*;

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

    // Case belongs to a user
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

    // Base64 image
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageBase64;

}