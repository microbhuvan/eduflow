package com.eduflow.service;

import com.eduflow.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.file.Path;

@Service
public class PdfStorage {
    private final Path root;

    public PdfStorage(@Value("${app.upload-dir}") String uploadDir) {
        this.root = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public Path resolve(String storedName) {
        Path file = root.resolve(storedName).normalize();
        if (!file.startsWith(root)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file.");
        }
        return file;
    }
}
