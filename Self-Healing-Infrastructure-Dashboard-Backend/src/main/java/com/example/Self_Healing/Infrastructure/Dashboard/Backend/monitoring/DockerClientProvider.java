package com.selfhealing.monitoring;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import org.springframework.stereotype.Component;

@Component
public class DockerClientProvider {

    private final DockerClient dockerClient;

    public DockerClientProvider() {

        DefaultDockerClientConfig config =
                DefaultDockerClientConfig.createDefaultConfigBuilder()
                        .withDockerHost("unix:///var/run/docker.sock")
                        .build();

        this.dockerClient = DockerClientBuilder
                .getInstance(config)
                .build();
    }

    public DockerClient getClient() {
        return dockerClient;
    }
}