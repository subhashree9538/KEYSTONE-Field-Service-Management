package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Customer;
import com.example.demo.entity.WorkOrder;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.WorkOrderRepository;

@Service
public class CustomerPortalService {

    private final CustomerRepository customerRepository;
    private final WorkOrderRepository workOrderRepository;

    public CustomerPortalService(
            CustomerRepository customerRepository,
            WorkOrderRepository workOrderRepository) {

        this.customerRepository = customerRepository;
        this.workOrderRepository = workOrderRepository;
    }

    public List<WorkOrder> getCustomerWorkOrders(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return workOrderRepository.findByCustomer(customer);
    }
}