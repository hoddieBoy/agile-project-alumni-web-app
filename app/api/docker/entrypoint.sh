#!/bin/bash

# Run the Spring Boot application with remote debugging enabled and migrate the database(flyway)
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005" &
mvn flyway:migrate

# Monitor changes to source files and recompile the application and migrate the database(flyway)
while true; do
  inotifywait -e modify,create,delete,move -r ./src/ && mvn compile && mvn flyway:migrate
done
