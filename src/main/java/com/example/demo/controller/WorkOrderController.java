package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.WorkOrder;
import com.example.demo.service.WorkOrderService;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @PostMapping
    public WorkOrder createWorkOrder(@RequestBody WorkOrder workOrder) {
        return workOrderService.saveWorkOrder(workOrder);
    }

    @GetMapping
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderService.getAllWorkOrders();
    }

    @PostMapping("/{workOrderId}/assign/{technicianId}")
    public WorkOrder assignTechnician(
            @PathVariable Long workOrderId,
            @PathVariable Long technicianId) {

        return workOrderService.assignTechnician(workOrderId, technicianId);
    }

    @PostMapping("/{workOrderId}/status")
    public WorkOrder updateStatus(
            @PathVariable Long workOrderId,
            @RequestBody StatusRequest request) {

        return workOrderService.updateStatus(
                workOrderId,
                request.status()
        );
    }

    public record StatusRequest(String status) {
    }
}