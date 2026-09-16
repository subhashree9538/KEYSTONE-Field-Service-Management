package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TimeLog;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {

}