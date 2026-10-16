# ==========================================
# STAGE 1: Build the JAR with Maven & Java 21
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# 1. Copy pom.xml and pre-download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy source code and build the production JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the compiled JAR from Stage 1
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080 to the network
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]