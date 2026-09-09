package com.selfhealing.controller;

import com.selfhealing.model.ServiceStatus;
import com.selfhealing.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.selfhealing.model.ContainerInfo;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/health")
    public String health() {
        return dashboardService.getHealth();
    }

    @GetMapping("/services")
    public List<ServiceStatus> services() {
        return dashboardService.getServices();
    }
    @GetMapping("/containers")
public List<ContainerInfo> containers() {
    return dashboardService.getContainers();
}
}