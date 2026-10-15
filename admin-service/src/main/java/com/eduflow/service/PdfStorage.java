package com.eduflow.service;

import com.eduflow.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class PdfStorage {
    private final Path root;

    public PdfStorage(@Value("${app.upload-dir}") String uploadDir) {
        this.root = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public String store(Long lessonId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a PDF file.");
        }
        String type = file.getContentType();
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if ((type == null || !type.equals("application/pdf")) && !original.endsWith(".pdf")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only PDF files can be attached.");
        }
        String storedName = "lesson-" + lessonId + "-" + UUID.randomUUID() + ".pdf";
        try {
            Files.createDirectories(root);
            file.transferTo(root.resolve(storedName));
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "The PDF could not be saved.");
        }
        return storedName;
    }

    public void delete(String storedName) {
        if (storedName == null || storedName.isBlank()) {
            return;
        }
        try {
            Files.deleteIfExists(resolve(storedName));
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "The old PDF could not be removed.");
        }
    }

    public Path resolve(String storedName) {
        Path file = root.resolve(storedName).normalize();
        if (!file.startsWith(root)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file.");
        }
        return file;
    }
}
