package com.demo.domain.applicant.dto.response;

import com.demo.domain.applicant.entity.ApplicantFile;

public record ApplicantFileResponse(
    Long applicantFileId,
    String fileName,
    String fileType,
    String fileUrl
) {
    public static ApplicantFileResponse from(ApplicantFile file) {
        return new ApplicantFileResponse(
            file.getApplicantFileId(),
            file.getFileName(),
            file.getFileType(),
            file.getFileUrl()
        );
    }
}

