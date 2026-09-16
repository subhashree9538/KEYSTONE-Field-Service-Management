package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Part;

public interface PartRepository extends JpaRepository<Part, Long> {

}