package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.TimeLog;
import com.example.demo.service.TimeLogService;

@RestController
@RequestMapping("/api/time-logs")
public class TimeLogController {

    private final TimeLogService timeLogService;

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @PostMapping("/{workOrderId}/{technicianId}")
    public TimeLog createTimeLog(
            @PathVariable Long workOrderId,
            @PathVariable Long technicianId,
            @RequestBody TimeLog timeLog) {

        return timeLogService.saveTimeLog(
                workOrderId,
                technicianId,
                timeLog
        );
    }

    @GetMapping
    public List<TimeLog> getAllTimeLogs() {
        return timeLogService.getAllTimeLogs();
    }
}