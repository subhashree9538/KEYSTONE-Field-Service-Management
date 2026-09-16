package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.WorkOrder;
import com.example.demo.service.CustomerPortalService;

@RestController
@RequestMapping("/api/customer-portal")
public class CustomerPortalController {

    private final CustomerPortalService customerPortalService;

    public CustomerPortalController(
            CustomerPortalService customerPortalService) {
        this.customerPortalService = customerPortalService;
    }

    @GetMapping("/{customerId}/work-orders")
    public List<WorkOrder> getCustomerWorkOrders(
            @PathVariable Long customerId) {

        return customerPortalService.getCustomerWorkOrders(customerId);
    }
}