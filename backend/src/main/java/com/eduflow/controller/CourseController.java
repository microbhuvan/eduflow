package com.eduflow.controller;

import com.eduflow.dto.*;
import com.eduflow.security.UserPrincipal;
import com.eduflow.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDto>> getCourses() {
        return ResponseEntity.ok(courseService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    /** Full course workspace: overview, modules, announcements, roster (admin). */
    @GetMapping("/{id}/workspace")
    public ResponseEntity<CourseWorkspaceDto> getWorkspace(@PathVariable Long id,
                                                           @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(courseService.getWorkspace(id, principal));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> createCourse(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/modules")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseModuleDto> addModule(@PathVariable Long id, @Valid @RequestBody CourseModuleRequest request) {
        return ResponseEntity.ok(courseService.addModule(id, request));
    }

    @PutMapping("/{id}/modules/{moduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseModuleDto> updateModule(@PathVariable Long id, @PathVariable Long moduleId,
                                                        @Valid @RequestBody CourseModuleRequest request) {
        return ResponseEntity.ok(courseService.updateModule(id, moduleId, request));
    }

    @DeleteMapping("/{id}/modules/{moduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id, @PathVariable Long moduleId) {
        courseService.deleteModule(id, moduleId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/announcements")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseAnnouncementDto> addAnnouncement(@PathVariable Long id,
                                                                 @Valid @RequestBody CourseAnnouncementRequest request) {
        return ResponseEntity.ok(courseService.addAnnouncement(id, request));
    }

    @DeleteMapping("/{id}/announcements/{announcementId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id, @PathVariable Long announcementId) {
        courseService.deleteAnnouncement(id, announcementId);
        return ResponseEntity.noContent().build();
    }
}
