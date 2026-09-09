package com.selfhealing.model;

public class ContainerInfo {

    private String id;
    private String name;
    private String image;
    private String status;
    private double cpu;
    private long memoryMb;
    private long memoryLimitMb;
    private int restarts;
    private String uptime;
    private String ports;

    public ContainerInfo(
            String id,
            String name,
            String image,
            String status,
            double cpu,
            long memoryMb,
            long memoryLimitMb,
            int restarts,
            String uptime,
            String ports) {

        this.id = id;
        this.name = name;
        this.image = image;
        this.status = status;
        this.cpu = cpu;
        this.memoryMb = memoryMb;
        this.memoryLimitMb = memoryLimitMb;
        this.restarts = restarts;
        this.uptime = uptime;
        this.ports = ports;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImage() {
        return image;
    }

    public String getStatus() {
        return status;
    }

    public double getCpu() {
        return cpu;
    }

    public long getMemoryMb() {
        return memoryMb;
    }

    public long getMemoryLimitMb() {
        return memoryLimitMb;
    }

    public int getRestarts() {
        return restarts;
    }

    public String getUptime() {
        return uptime;
    }

    public String getPorts() {
        return ports;
    }
}
