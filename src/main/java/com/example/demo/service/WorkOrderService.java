
package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.entity.WorkOrder;
import com.example.demo.entity.WorkOrderStatusHistory;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkOrderRepository;
import com.example.demo.repository.WorkOrderStatusHistoryRepository;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final WorkOrderStatusHistoryRepository statusHistoryRepository;
    private final NotificationService notificationService;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            UserRepository userRepository,
            AuditLogService auditLogService,
            WorkOrderStatusHistoryRepository statusHistoryRepository,
            NotificationService notificationService) {

        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.statusHistoryRepository = statusHistoryRepository;
        this.notificationService = notificationService;
    }

    public WorkOrder saveWorkOrder(WorkOrder workOrder) {

        if (workOrder.getCode() == null || workOrder.getCode().isBlank()) {
            workOrder.setCode("WO-" + System.currentTimeMillis());
        }

        if (workOrder.getStatus() == null || workOrder.getStatus().isBlank()) {
            workOrder.setStatus("NEW");
        }

        if (workOrder.getSlaDueDate() == null) {
            workOrder.setSlaDueDate(LocalDateTime.now().plusDays(2));
        }

        return workOrderRepository.save(workOrder);
    }

    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    public WorkOrder assignTechnician(Long workOrderId, Long technicianId) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (!"TECHNICIAN".equals(technician.getRole())) {
            throw new RuntimeException("User is not a technician");
        }

        String oldStatus = workOrder.getStatus();

        if ("CLOSED".equals(oldStatus) || "CANCELLED".equals(oldStatus)) {
            throw new RuntimeException(
                    "Closed or cancelled work order cannot be assigned"
            );
        }

        workOrder.setTechnician(technician);
        workOrder.setStatus("ASSIGNED");

        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

        saveStatusHistory(
                savedWorkOrder,
                oldStatus,
                "ASSIGNED",
                technician.getUsername(),
                "Technician assigned"
        );

        auditLogService.createAuditLog(
                "TECHNICIAN_ASSIGNED",
                technician.getUsername(),
                "Work order " + workOrder.getCode()
                        + " assigned to " + technician.getUsername()
        );

        notificationService.createNotification(
                "Work order " + workOrder.getCode()
                        + " has been assigned to " + technician.getUsername(),
                "TECHNICIAN_ASSIGNED"
        );

        return savedWorkOrder;
    }

    public WorkOrder updateStatus(Long workOrderId, String newStatus) {

        WorkOrder workOrder = workOrderRepository.findById(workOrderId)
                .orElseThrow(() -> new RuntimeException("Work order not found"));

        if (workOrder.getTechnician() == null) {
            throw new RuntimeException(
                    "Work order is not assigned to a technician"
            );
        }

        String oldStatus = workOrder.getStatus();

        if ("CLOSED".equals(oldStatus) || "CANCELLED".equals(oldStatus)) {
            throw new RuntimeException(
                    "Closed or cancelled work order cannot be changed"
            );
        }

        if (!isValidTransition(oldStatus, newStatus)) {
            throw new RuntimeException(
                    "Invalid status transition from "
                            + oldStatus + " to " + newStatus
            );
        }

        workOrder.setStatus(newStatus);

        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

        saveStatusHistory(
                savedWorkOrder,
                oldStatus,
                newStatus,
                workOrder.getTechnician().getUsername(),
                null
        );

        auditLogService.createAuditLog(
                "WORK_ORDER_STATUS_CHANGED",
                workOrder.getTechnician().getUsername(),
                "Work order " + workOrder.getCode()
                        + " status changed from "
                        + oldStatus + " to " + newStatus
        );

        if ("COMPLETED".equals(newStatus)) {

            notificationService.createNotification(
                    "Work Order " + workOrder.getCode()
                            + " has been completed",
                    "WORK_ORDER_COMPLETED"
            );
        }

        return savedWorkOrder;
    }

    private boolean isValidTransition(String oldStatus, String newStatus) {

        if ("NEW".equals(oldStatus) && "ASSIGNED".equals(newStatus)) {
            return true;
        }

        if ("ASSIGNED".equals(oldStatus) && "IN_PROGRESS".equals(newStatus)) {
            return true;
        }

        if ("IN_PROGRESS".equals(oldStatus) && "ON_HOLD".equals(newStatus)) {
            return true;
        }

        if ("ON_HOLD".equals(oldStatus) && "IN_PROGRESS".equals(newStatus)) {
            return true;
        }

        if ("IN_PROGRESS".equals(oldStatus) && "COMPLETED".equals(newStatus)) {
            return true;
        }

        if ("COMPLETED".equals(oldStatus) && "CLOSED".equals(newStatus)) {
            return true;
        }

        if (!"CLOSED".equals(oldStatus)
                && !"CANCELLED".equals(oldStatus)
                && "CANCELLED".equals(newStatus)) {
            return true;
        }

        return false;
    }

    private void saveStatusHistory(
            WorkOrder workOrder,
            String fromStatus,
            String toStatus,
            String changedBy,
            String note) {

        WorkOrderStatusHistory history = new WorkOrderStatusHistory();

        history.setWorkOrder(workOrder);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setChangedBy(changedBy);
        history.setChangedAt(LocalDateTime.now());
        history.setNote(note);

        statusHistoryRepository.save(history);
    }
}