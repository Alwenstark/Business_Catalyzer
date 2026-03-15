package com.businesscatalyzer.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(length = 2000)
    private String text;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageBase64;

    private LocalDateTime time;
}