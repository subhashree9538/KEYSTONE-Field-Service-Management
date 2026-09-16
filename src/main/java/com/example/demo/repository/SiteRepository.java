package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Site;

public interface SiteRepository extends JpaRepository<Site, Long> {

}