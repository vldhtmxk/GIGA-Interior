package com.demo.domain.inquiry.notification;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.demo.domain.inquiry.entity.Inquiry;
import com.demo.domain.inquiry.enums.InquiryStatus;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InquiryNotificationService {
    private static final Logger log = LoggerFactory.getLogger(InquiryNotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();

    @Value("${app.notify.slack.enabled:false}")
    private boolean slackEnabled;
    @Value("${app.notify.slack.webhook-url:}")
    private String slackWebhookUrl;
    @Value("${app.notify.email.enabled:false}")
    private boolean emailEnabled;
    @Value("${app.notify.email.to:}")
    private String notifyEmailTo;

    public InquiryNotificationService(ObjectProvider<JavaMailSender> mailSenderProvider, ObjectMapper objectMapper) {
        this.mailSenderProvider = mailSenderProvider;
        this.objectMapper = objectMapper;
    }

    public void notifyInquiryCreated(Inquiry inquiry) {
        notifySlack("[문의 접수] " + summary(inquiry));
        notifyEmail("문의 접수: " + safe(inquiry.getName()), """
            신규 문의가 접수되었습니다.
            이름: %s
            이메일: %s
            전화번호: %s
            프로젝트 유형: %s
            예산 범위: %s

            문의 내용:
            %s
            """.formatted(
            safe(inquiry.getName()),
            safe(inquiry.getEmail()),
            safe(inquiry.getPhone()),
            safe(inquiry.getProjectType()),
            safe(inquiry.getBudgetRange()),
            safe(inquiry.getMessage())
        ));
    }

    public void notifyInquiryUpdated(Inquiry inquiry) {
        if (InquiryStatus.DONE.equals(inquiry.getStatus())) {
            notifySlack("[문의 완료] " + summary(inquiry));
        }
    }

    public void sendReplyEmailToCustomer(Inquiry inquiry, String subject, String body) {
        if (isBlank(inquiry.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "문의자 이메일이 없습니다.");
        }
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "메일 발송 설정이 되어 있지 않습니다.");
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(inquiry.getEmail());
            msg.setSubject(subject);
            msg.setText(body);
            sender.send(msg);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "메일 발송에 실패했습니다.");
        }
    }

    private void notifySlack(String text) {
        if (!slackEnabled || isBlank(slackWebhookUrl)) return;
        try {
            String payload = objectMapper.writeValueAsString(new SlackMessage(text));
            HttpRequest req = HttpRequest.newBuilder(URI.create(slackWebhookUrl))
                .timeout(Duration.ofSeconds(5))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();
            httpClient.sendAsync(req, HttpResponse.BodyHandlers.discarding())
                .exceptionally(ex -> {
                    log.warn("Slack notification failed: {}", ex.getMessage());
                    return null;
                });
        } catch (Exception e) {
            log.warn("Slack notification build failed: {}", e.getMessage());
        }
    }

    private void notifyEmail(String subject, String body) {
        if (!emailEnabled || isBlank(notifyEmailTo)) return;
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) {
            log.warn("Email notification enabled but mail sender is not configured.");
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(notifyEmailTo);
            msg.setSubject(subject);
            msg.setText(body);
            sender.send(msg);
        } catch (Exception e) {
            log.warn("Email notification failed: {}", e.getMessage());
        }
    }

    private String summary(Inquiry inquiry) {
        return "%s / %s / %s".formatted(safe(inquiry.getName()), safe(inquiry.getProjectType()), safe(inquiry.getStatus() == null ? null : inquiry.getStatus().name()));
    }

    private String safe(String v) { return v == null ? "-" : v; }
    private boolean isBlank(String v) { return v == null || v.isBlank(); }

    private record SlackMessage(String text) {}
}
