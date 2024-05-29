# Base stage for shared setup
FROM eclipse-temurin:21-jdk-alpine AS base
WORKDIR /app

# Install necessary tools and cleanup in one layer
RUN apk add --no-cache maven

# Copy project descriptor
COPY pom.xml .

# Builder stage to handle dependencies
FROM base AS builder
RUN apk add --no-cache curl jq
# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Development stage for development environment setup
FROM builder AS development
RUN apk add --no-cache inotify-tools bash dos2unix

COPY docker/entrypoint.sh /usr/local/bin/

RUN dos2unix /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Test stage builds upon the builder stage
FROM builder AS test
# Additional test setups or dependencies can be handled here

# Production stage for final deployment
FROM base AS production
COPY --from=builder /app/target/*.jar /app/

CMD ["java", "-jar", "/app/app.jar"]
