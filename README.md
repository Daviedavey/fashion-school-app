 The Fashion School App 📱✨

A full-stack, cross-platform mobile application for iOS & Android designed to enhance the learning experience for students and teachers at a creative school. This repository contains both the React Native frontend and the Spring Boot backend.

 🚀 Live Demo

DEMO_GIF will be availabe shortly


🏛️ Project Architecture

This project is a full-stack application built with a modern, industry-standard stack, structured as a mono-repo.

-   `/TfsFrontEnd`: A React Native mobile application for iOS and Android that serves as the client. It is responsible for the user interface and all user interactions.
-   `/backEnd`: A Spring Boot (Java) REST API that serves as the backend. It handles business logic, security, and communication with the database.

The application follows a classic client-server model with stateless JWT-based authentication.

 ✨ Key Features

-   ✅ Role-Based Authentication: Secure user registration and login flow with distinct "Teacher" and "Student" roles, managed by JWTs.
-   ✅ Dynamic Blog System: Teachers can create and delete posts with text and images. All users can view the feed, which features "Read More" text expansion and a full-screen image viewer.
-   ✅ Level-Based Assignment Module**: Teachers can create visual assignments with multiple images and assign a difficulty level (Beginner, Advanced, Expert).
-   ✅ Personalized Student Experience**: The app intelligently filters content, ensuring students only see assignments that match their specific group's designated skill levels.
-   ✅ Customizable Dashboard**: Teachers can update a "Fashion Icon of the Week" feature, providing dynamic and engaging content for the student home screen.

🛠️ Tech Stack

 Frontend (`/TfsFrontEnd`)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
-  UI:React Native Paper
-  Navigation: React Navigation
-  API Client: Axios

 Backend (`backEnd`)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
-   Security: Spring Security & JWT
-   Data Access: Spring Data JPA / Hibernate
-   Build Tool: Apache Maven

⚙️ Setup & Installation

To run this project locally, you will need to run both the backend server and the frontend application simultaneously.

 Prerequisites
-   Java JDK 17+ & Apache Maven
-   Node.js & npm
-   PostgreSQL Database
-   React Native development environment (Xcode for iOS, Android Studio for Android)

 1. Backend Setup (`/TfsBackEnd`)

Configure Database: Create a new PostgreSQL database. In `TfsBackEnd/src/main/resources/application.properties`, update the `spring.datasource.url`, `username`, and `password` with your local database credentials.
Run the Server: Navigate to the backend directory and run the application using Maven.
    ```bash
    cd TfsBackEnd
    mvn spring-boot:run
    ```
    The server will start on `http://localhost:8080`. The database tables will be created and seeded on the first run.

 2. Frontend Setup (`/TfsFrontEnd`)

 Install Dependencies: Open a new terminal window** and navigate to the frontend directory.
    ```bash
    cd TfsFrontEnd
    npm install
    ```
Configure API Endpoint: In `TfsFrontEnd/src/api/config.js`, ensure `API_BASE_URL` is pointing to your running backend.
    ```javascript
    // For the iOS Simulator
    export const API_BASE_URL = 'http://localhost:8080';
    ```
Run the Application:**
    -   For iOS:
        ```bash
        cd ios && pod install && cd ..
        npx react-native run-ios
        ```
    -   For Android:
        ```bash
        npx react-native run-android
        ```

---

 🧠 Development & Problem-Solving

A significant part of this project involved navigating and resolving complex environment and dependency issues inherent in the React Native ecosystem. Key challenges included:

-   Diagnosing and fixing native iOS build failures by aligning dependency versions (`react-native-screens`), manually configuring Xcode build phases for font assets, and correcting `Podfile` settings.
-   Systematically debugging a chain of JavaScript bundler errors by purging caches (`metro`, `watchman`), isolating components, and correcting misconfigurations in the Metro bundler.
-   Refactoring component state management to resolve subtle race conditions with asynchronous data fetching.

This process demonstrates a deep understanding of the full development lifecycle, from initial implementation to advanced debugging and environment stabilization.
