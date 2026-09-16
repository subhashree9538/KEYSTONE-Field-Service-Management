package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.WorkOrderStatusHistory;
import com.example.demo.repository.WorkOrderStatusHistoryRepository;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderStatusHistoryController {

    private final WorkOrderStatusHistoryRepository repository;

    public WorkOrderStatusHistoryController(
            WorkOrderStatusHistoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/{workOrderId}/history")
    public List<WorkOrderStatusHistory> getHistory(
            @PathVariable Long workOrderId) {

        return repository.findByWorkOrderId(workOrderId);
    }
}