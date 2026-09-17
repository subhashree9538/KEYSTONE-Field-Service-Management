FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8094

CMD ["sh", "-c", "java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=${PORT:-8094}"]