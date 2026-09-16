package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.TimeLog;
import com.example.demo.entity.User;
import com.example.demo.entity.WorkOrder;
import com.example.demo.repository.TimeLogRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkOrderRepository;

@Service
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    public TimeLogService(
            TimeLogRepository timeLogRepository,
            WorkOrderRepository workOrderRepository,
            UserRepository userRepository) {

        this.timeLogRepository = timeLogRepository;
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    public TimeLog saveTimeLog(
            Long workOrderId,
            Long technicianId,
            TimeLog timeLog) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (!"TECHNICIAN".equals(technician.getRole())) {
            throw new RuntimeException("User is not a technician");
        }

        if (timeLog.getMinutes() == null || timeLog.getMinutes() <= 0) {
            throw new RuntimeException("Minutes must be greater than zero");
        }

        timeLog.setWorkOrder(workOrder);
        timeLog.setTechnician(technician);
        timeLog.setLoggedAt(LocalDateTime.now());

        return timeLogRepository.save(timeLog);
    }

    public List<TimeLog> getAllTimeLogs() {
        return timeLogRepository.findAll();
    }
}