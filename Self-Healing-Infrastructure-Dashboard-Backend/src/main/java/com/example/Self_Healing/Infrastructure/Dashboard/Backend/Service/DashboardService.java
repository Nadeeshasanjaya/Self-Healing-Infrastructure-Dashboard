package com.selfhealing.service;
import com.selfhealing.model.ContainerInfo;
import com.selfhealing.monitoring.DockerClientProvider;

import com.github.dockerjava.api.model.Container;

import java.util.ArrayList;
import java.util.stream.Collectors;

import com.selfhealing.model.ServiceStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Service
public class DashboardService {

    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate;

   private final DockerClientProvider dockerClientProvider;

public DashboardService(
        JdbcTemplate jdbcTemplate,
        DockerClientProvider dockerClientProvider) {

    this.jdbcTemplate = jdbcTemplate;
    this.dockerClientProvider = dockerClientProvider;
    this.restTemplate = new RestTemplate();
}

    public String getHealth() {
        return isDatabaseOnline() ? "UP" : "DEGRADED";
    }

    public List<ServiceStatus> getServices() {
        ServiceStatus frontend = probeService("Frontend", "http://frontend/health");
        ServiceStatus backend = probeService("Backend API", "http://backend:8081/api/health");
        ServiceStatus mysql = checkMySql();
        ServiceStatus nginx = probeService("Nginx", "http://frontend/health");

        return List.of(frontend, backend, mysql, nginx);
    }

    private ServiceStatus probeService(String name, String url) {
        long start = System.nanoTime();
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            long elapsed = Math.max(1, (System.nanoTime() - start) / 1_000_000);
            String status = response.getStatusCode().is2xxSuccessful() ? "ONLINE" : "DEGRADED";
            return new ServiceStatus(name, status, elapsed);
        } catch (RestClientException ex) {
            long elapsed = Math.max(1, (System.nanoTime() - start) / 1_000_000);
            return new ServiceStatus(name, "OFFLINE", elapsed);
        }
    }

    private ServiceStatus checkMySql() {
        long start = System.nanoTime();
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            long elapsed = Math.max(1, (System.nanoTime() - start) / 1_000_000);
            String status = (result != null && result == 1) ? "ONLINE" : "DEGRADED";
            return new ServiceStatus("MySQL", status, elapsed);
        } catch (Exception ex) {
            long elapsed = Math.max(1, (System.nanoTime() - start) / 1_000_000);
            return new ServiceStatus("MySQL", "OFFLINE", elapsed);
        }
    }

    private boolean isDatabaseOnline() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception ex) {
            return false;
        }
    }
    public List<ContainerInfo> getContainers() {

    List<Container> containers = dockerClientProvider
            .getClient()
            .listContainersCmd()
            .withShowAll(true)
            .exec();

    List<ContainerInfo> result = new ArrayList<>();

    for (Container container : containers) {

        String name = container.getNames() != null
                && container.getNames().length > 0
                ? container.getNames()[0].replaceFirst("^/", "")
                : container.getId().substring(0, 12);

        String image = container.getImage();

        String status = container.getStatus() != null
                ? container.getStatus().toUpperCase()
                : "UNKNOWN";

        int restarts = container.getStatus() != null
                ? 0
                : 0;

        String ports = "";

        if (container.getPorts() != null) {
            ports = java.util.Arrays.stream(container.getPorts())
                    .map(port -> {
                        String publicPort = port.getPublicPort() != null
                                ? port.getPublicPort().toString()
                                : "";

                        String privatePort = port.getPrivatePort() != null
                                ? port.getPrivatePort().toString()
                                : "";

                        return publicPort.isEmpty()
                                ? privatePort
                                : publicPort + ":" + privatePort;
                    })
                    .collect(Collectors.joining(", "));
        }

        result.add(
                new ContainerInfo(
                        container.getId(),
                        name,
                        image,
                        status,
                        0,
                        0,
                        0,
                        restarts,
                        "Unknown",
                        ports
                )
        );
    }

    return result;
}
}