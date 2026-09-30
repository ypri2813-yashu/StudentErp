import React, { useState } from 'react';
import {
  Code2,
  Database,
  ShieldCheck,
  Server,
  Layers,
  FileCode,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  Workflow
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSnippet, setActiveSnippet] = useState<'controller' | 'od_controller' | 'security' | 'mysql' | 'mongo'>('od_controller');
  const [copied, setCopied] = useState(false);

  const snippets = {
    od_controller: `// OnDutyWorkflowController.java (Spring Boot 3.3.x / Java 21)
package in.edu.eec.classroom.controller;

import in.edu.eec.classroom.dto.ODApplicationRequest;
import in.edu.eec.classroom.dto.ODReviewRequest;
import in.edu.eec.classroom.entity.OnDutyRequest;
import in.edu.eec.classroom.entity.ODStatus;
import in.edu.eec.classroom.service.OnDutyWorkflowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/od")
@CrossOrigin(origins = "*")
public class OnDutyWorkflowController {

    private final OnDutyWorkflowService odService;

    public OnDutyWorkflowController(OnDutyWorkflowService odService) {
        this.odService = odService;
    }

    /**
     * 1. Student submits OD application
     */
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<OnDutyRequest> applyOD(@RequestBody ODApplicationRequest request) {
        OnDutyRequest submitted = odService.submitOD(request);
        return ResponseEntity.status(201).body(submitted);
    }

    /**
     * 2. Class Coordinator / Mentor evaluates OD (Approve / Reject / Forward to HOD)
     */
    @PutMapping("/{id}/mentor-review")
    @PreAuthorize("hasRole('MENTOR') or hasRole('TEACHER')")
    public ResponseEntity<OnDutyRequest> reviewByMentor(
            @PathVariable Long id,
            @RequestBody ODReviewRequest review) {
        OnDutyRequest updated = odService.processMentorReview(id, review);
        return ResponseEntity.ok(updated);
    }

    /**
     * 3. HOD sanctions final approval or rejection
     * Automatically triggers ERP attendance credit hook upon approval
     */
    @PutMapping("/{id}/hod-sanction")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<OnDutyRequest> sanctionByHOD(
            @PathVariable Long id,
            @RequestBody ODReviewRequest review) {
        OnDutyRequest sanctioned = odService.processHODSanction(id, review);
        return ResponseEntity.ok(sanctioned);
    }

    /**
     * Retrieve student specific OD applications
     */
    @GetMapping("/student/{registerNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'HOD')")
    public ResponseEntity<List<OnDutyRequest>> getStudentODs(@PathVariable String registerNumber) {
        return ResponseEntity.ok(odService.findByRegisterNumber(registerNumber));
    }
}`,

    controller: `// NotesController.java (Spring Boot REST API)
package in.edu.eec.classroom.controller;

import in.edu.eec.classroom.entity.CourseNote;
import in.edu.eec.classroom.service.NotesStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
public class NotesController {

    private final NotesStorageService notesService;

    public NotesController(NotesStorageService notesService) {
        this.notesService = notesService;
    }

    /**
     * Cascading query: Department -> Semester -> Subject -> Unit -> Category
     */
    @GetMapping
    public ResponseEntity<List<CourseNote>> getNotes(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) String subjectCode,
            @RequestParam(required = false) String unit,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(notesService.findNotes(department, semester, subjectCode, unit, category));
    }

    /**
     * Subject Teacher uploads PDF, PPT, Question Bank
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TEACHER') or hasRole('HOD')")
    public ResponseEntity<CourseNote> uploadNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("subjectCode") String subjectCode,
            @RequestParam("unit") String unit,
            @RequestParam("category") String category,
            @RequestParam("description") String description) {
        CourseNote savedNote = notesService.storeNote(file, title, subjectCode, unit, category, description);
        return ResponseEntity.status(201).body(savedNote);
    }
}`,

    security: `// SecurityConfig.java (Spring Security 6 + Stateless JWT)
package in.edu.eec.classroom.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/api/v1/od/apply").hasRole("STUDENT")
                .requestMatchers("/api/v1/od/*/mentor-review").hasAnyRole("MENTOR", "TEACHER")
                .requestMatchers("/api/v1/od/*/hod-sanction").hasRole("HOD")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`,

    mysql: `-- MySQL 8.0 Schema DDL for Easwari Classroom ERP Extension
CREATE DATABASE IF NOT EXISTS eec_classroom_db CHARACTER SET utf8mb4;
USE eec_classroom_db;

-- 1. Users Table (Linked to ERP ID)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    erp_user_id VARCHAR(50) NOT NULL UNIQUE,
    register_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'TEACHER', 'MENTOR', 'HOD', 'ADMIN') NOT NULL,
    department VARCHAR(80) NOT NULL,
    semester INT,
    section CHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Faculty Notes Management
CREATE TABLE course_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    department VARCHAR(80) NOT NULL,
    semester INT NOT NULL,
    unit_number VARCHAR(30) NOT NULL, -- 'Unit 1', 'Unit 2', etc.
    category ENUM('Lecture Notes', 'Question Bank', 'Assignment Handout', 'Important Questions', 'Lab Manual') NOT NULL,
    faculty_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_hierarchy (department, semester, subject_code, unit_number)
);

-- 3. On-Duty (OD) Workflow Requests
CREATE TABLE on_duty_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL UNIQUE, -- 'EEC/OD/2026/0418'
    student_id BIGINT NOT NULL,
    category ENUM('Hackathon & Expo', 'Paper Presentation', 'Symposium', 'Sports / Zonal', 'Cultural Event', 'Internship / Industrial Visit', 'NSS / NCC') NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    organizing_college VARCHAR(255) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    total_days INT NOT NULL,
    periods_requested VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    proof_document_path VARCHAR(500),
    status ENUM('Pending', 'Under Mentor Review', 'Forwarded to HOD', 'Approved', 'Rejected') DEFAULT 'Under Mentor Review',
    mentor_reviewer_id BIGINT,
    mentor_comments TEXT,
    mentor_action_at TIMESTAMP NULL,
    hod_reviewer_id BIGINT,
    hod_comments TEXT,
    hod_action_at TIMESTAMP NULL,
    erp_attendance_credited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (mentor_reviewer_id) REFERENCES users(id),
    FOREIGN KEY (hod_reviewer_id) REFERENCES users(id)
);`,

    mongo: `// MongoDB Document Schema (Alternative / Supplementary NoSQL Collection)
// Database: eec_classroom_mongodb

// 1. notes collection document
{
  "_id": ObjectId("66fa5a0f1245..."),
  "title": "Unit 2: Decision Trees & SVM Kernels",
  "subjectCode": "CS3551",
  "subjectName": "Machine Learning",
  "department": "Computer Science and Engineering",
  "semester": 5,
  "unit": "Unit 2",
  "category": "Lecture Notes",
  "faculty": {
    "id": "teacher-1",
    "name": "Dr. K. Meenakshi",
    "email": "meenakshi.k@eec.srmrmp.edu.in"
  },
  "file": {
    "url": "https://storage.eec.edu.in/notes/cs3551_unit2.pdf",
    "format": "pdf",
    "sizeMb": 4.8
  },
  "tags": ["Entropy", "SVM", "Kernel Trick"],
  "downloadCount": 142,
  "createdAt": ISODate("2026-09-24T10:00:00Z")
}

// 2. onDutyRequests collection document
{
  "_id": ObjectId("66fa5b2e9871..."),
  "applicationId": "EEC/OD/2026/0418",
  "student": {
    "registerNumber": "310622104082",
    "name": "Harish Kumar S",
    "department": "CSE",
    "semester": 5,
    "section": "B"
  },
  "category": "Hackathon & Expo",
  "eventName": "Smart India Hackathon 2026 - Regional Round",
  "organizingCollege": "IIT Madras Research Park",
  "dates": {
    "from": ISODate("2026-10-04"),
    "to": ISODate("2026-10-05"),
    "totalDays": 2
  },
  "workflow": {
    "currentStatus": "Forwarded to HOD",
    "mentorReview": {
      "mentorName": "Dr. S. Vignesh",
      "decision": "FORWARDED",
      "comments": "Verified SIH shortlist letter. Recommended for HOD sanction.",
      "timestamp": ISODate("2026-09-28T14:30:00Z")
    },
    "hodReview": null
  },
  "erpSync": {
    "attendanceCredited": false
  }
}`
  };

  const copyCode = () => {
    navigator.clipboard.writeText(snippets[activeSnippet]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#240046] to-[#10002b] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-400/30 mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>Full-Stack Enterprise Architecture</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Spring Boot + Spring Security + JWT + MySQL / MongoDB
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Architectural blueprint linking the React frontend to Spring Boot 3.3 REST controllers with role-based access control (RBAC), relational MySQL schemas, and automatic ERP sync.
            </p>
          </div>
        </div>
      </div>

      {/* Visual System Flowchart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          End-to-End System Integration Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* React Frontend */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
            <span className="font-bold text-blue-700 dark:text-blue-300 block text-xs">
              1. ReactJS Frontend
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>• Role-Based Dashboards</li>
              <li>• Bearer JWT Auth Header</li>
              <li>• Cascading Notes Hierarchy</li>
              <li>• OD Multi-Step Stepper</li>
              <li>• AI NavBot Assistant</li>
            </ul>
          </div>

          {/* Spring Security / Gateway */}
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
            <span className="font-bold text-purple-700 dark:text-purple-300 block text-xs">
              2. Spring Security Filter
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>• Stateless JWT Validation</li>
              <li>• Role Claims: <code>ROLE_STUDENT</code>, <code>ROLE_TEACHER</code>, <code>ROLE_MENTOR</code>, <code>ROLE_HOD</code></li>
              <li>• <code>@PreAuthorize</code> Enforcement</li>
            </ul>
          </div>

          {/* Spring Boot REST APIs */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
            <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-xs">
              3. Spring Boot REST APIs
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>• <code>/api/v1/notes</code></li>
              <li>• <code>/api/v1/od/**</code></li>
              <li>• <code>/api/v1/announcements</code></li>
              <li>• ERP Attendance Sync Hook</li>
              <li>• File Storage Service</li>
            </ul>
          </div>

          {/* MySQL Database */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <span className="font-bold text-amber-700 dark:text-amber-300 block text-xs">
              4. Database (MySQL / Mongo)
            </span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300">
              <li>• <code>users</code> & profiles</li>
              <li>• <code>course_notes</code> (Unit 1-5)</li>
              <li>• <code>on_duty_requests</code></li>
              <li>• Multi-Tier Audit Log</li>
              <li>• MongoDB Document Store</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Snippet Viewer */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveSnippet('od_controller')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                activeSnippet === 'od_controller'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              OnDutyWorkflowController.java
            </button>
            <button
              onClick={() => setActiveSnippet('controller')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                activeSnippet === 'controller'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              NotesController.java
            </button>
            <button
              onClick={() => setActiveSnippet('security')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                activeSnippet === 'security'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              SecurityConfig.java
            </button>
            <button
              onClick={() => setActiveSnippet('mysql')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                activeSnippet === 'mysql'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              schema.sql (MySQL)
            </button>
            <button
              onClick={() => setActiveSnippet('mongo')}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                activeSnippet === 'mongo'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              schema.json (MongoDB)
            </button>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-4 font-mono text-slate-300 overflow-x-auto text-[11px] leading-relaxed max-h-[500px] scrollbar-thin">
          {snippets[activeSnippet]}
        </pre>
      </div>
    </div>
  );
};
