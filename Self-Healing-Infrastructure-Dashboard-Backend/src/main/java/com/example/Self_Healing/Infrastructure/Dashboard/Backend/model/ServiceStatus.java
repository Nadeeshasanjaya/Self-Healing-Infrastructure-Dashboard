package com.selfhealing.model;

public class ServiceStatus {

    private String name;
    private String status;
    private double responseTime;

    public ServiceStatus() {
    }

    public ServiceStatus(String name, String status, double responseTime) {
        this.name = name;
        this.status = status;
        this.responseTime = responseTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(double responseTime) {
        this.responseTime = responseTime;
    }
}