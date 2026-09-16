package com.example.demo.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.entity.WorkOrder;
import com.example.demo.repository.WorkOrderRepository;

@Service
public class DashboardService {

    private final WorkOrderRepository workOrderRepository;

    public DashboardService(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    public Map<String, Object> getDashboard() {

        List<WorkOrder> workOrders = workOrderRepository.findAll();

        long openJobs = workOrders.stream()
                .filter(w -> !"COMPLETED".equals(w.getStatus()))
                .count();

        long completedJobs = workOrders.stream()
                .filter(w -> "COMPLETED".equals(w.getStatus()))
                .count();

        long overdueJobs = workOrders.stream()
                .filter(w -> w.getSlaDueDate() != null)
                .filter(w -> w.getSlaDueDate().isBefore(LocalDateTime.now()))
                .filter(w -> !"COMPLETED".equals(w.getStatus()))
                .count();

        double slaCompliance = 0;

        if (completedJobs > 0) {
            long completedWithinSla = workOrders.stream()
                    .filter(w -> "COMPLETED".equals(w.getStatus()))
                    .filter(w -> w.getSlaDueDate() != null)
                    .filter(w -> w.getSlaDueDate().isAfter(LocalDateTime.now()))
                    .count();

            slaCompliance = (completedWithinSla * 100.0) / completedJobs;
        }

        double averageResolutionMinutes = 0;

        List<WorkOrder> completed = workOrders.stream()
                .filter(w -> "COMPLETED".equals(w.getStatus()))
                .toList();

        if (!completed.isEmpty()) {
            double totalMinutes = completed.stream()
                    .mapToLong(w -> {
                        if (w.getSlaDueDate() == null) {
                            return 0;
                        }

                        return Math.abs(
                                Duration.between(
                                        w.getSlaDueDate(),
                                        LocalDateTime.now()
                                ).toMinutes()
                        );
                    })
                    .sum();

            averageResolutionMinutes =
                    totalMinutes / completed.size();
        }

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalJobs", workOrders.size());
        dashboard.put("openJobs", openJobs);
        dashboard.put("completedJobs", completedJobs);
        dashboard.put("overdueJobs", overdueJobs);
        dashboard.put("slaCompliancePercentage", slaCompliance);
        dashboard.put("averageResolutionMinutes", averageResolutionMinutes);

        return dashboard;
    }
}