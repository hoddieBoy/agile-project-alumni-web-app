# Base stage for shared setup
FROM eclipse-temurin:21-jdk-alpine AS base
WORKDIR /app

# Install necessary tools and cleanup in one layer
RUN apk add --no-cache maven curl jq

# Copy project descriptor
COPY pom.xml .

# Builder stage to handle dependencies and build
FROM base AS builder
COPY src ./src
RUN mvn dependency:go-offline && mvn package -DskipTests

# Development stage for development environment setup
FROM builder AS development
RUN apk add --no-cache inotify-tools bash dos2unix
COPY docker/entrypoint.sh /usr/local/bin/
RUN dos2unix /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Production stage for final deployment
FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app

# Ensure no ENTRYPOINT is set in the production stage
ENTRYPOINT []

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/alumni-fil-api-1.0.jar /app/alumni-fil-api-1.0.jar

CMD ["java", "-jar", "/app/alumni-fil-api-1.0.jar"]
