# 🎵 OpenMusic API v3: A Feature-Rich Back-End for a Music Platform

## This application is the final project developed for the "Belajar Fundamental Back-End dengan JavaScript" course at Dicoding Academy. It is a comprehensive, secure, and scalable RESTful API designed to power a modern music application. The project adheres to an industry-standard curriculum validated by Amazon Web Services (AWS). <br> The API is built from the ground up, starting from a basic application and evolving to include advanced features like caching, message brokering, and file storage, reflecting real-world back-end development challenges.


## ✨ Key Features
- Full RESTful API Functionality: The API provides complete CRUD (Create, Read, Update, Delete) operations for all core resources, including albums, songs, users, playlists, and collaborations.
- Secure Authentication & Authorization: Implements a robust user management system with registration and login capabilities. API endpoints are protected using JSON Web Tokens (JWT) to ensure that only authenticated and authorized users can access or modify resources.
- Asynchronous Playlist Export via Message Broker: Users can export their playlist's song list to a JSON file, which is then sent to a target email address. This entire process is handled asynchronously using RabbitMQ to prevent blocking the main API server, ensuring high availability and a responsive user experience.
- A separate Consumer Service is responsible for listening to the message queue, processing export jobs, and sending emails with Nodemailer.
- Album Cover Uploads: Provides an endpoint for users to upload image files for album covers. The system handles multipart/form-data, validates file types and sizes, and serves the static image files through a public URL.
- Performance Caching with Redis: To optimize performance, the "like" count for albums is cached using Redis. This reduces database queries for frequently requested data and delivers faster responses. The cache is automatically cleared when the like count changes to ensure data consistency.
- Modular Architecture with Hapi Plugins: The application is built with a clean, maintainable structure using Hapi's plugin system. Each feature is encapsulated in its own module, separating services, handlers, routes, and data validation logic (using Joi).

## 🚀 Quick Start
### Prerequisites
Make sure you have the following services installed and running on your local machine (WSL is recommended on Windows):
- Node.js (v20.x LTS recommended)
- PostgreSQL
- Redis Server
- RabbitMQ Server

### 1. Clone the Repository
Clone this repository to your local machine:<br>
`git clone https://github.com/arima8/dicoding_open-music-api.git`<br>
`cd dicoding_open-music-api`<br>

### 2. Configure Environment Variables
You need to set up the `.env` file for both the API server and the consumer.<br>
- In the `openmusic-api-v3` directory, create a `.env` file based on the provided specifications.<br>
- In the openmusic-v3-consumer directory, create a `.env` file based on the provided specifications.<br>

Fill in your database credentials, SMTP details, and other required values.<br>

### 3. Install Dependencies
#### Install the required npm packages for both services:
- For the main API server<br>
`cd openmusic-api-v3`<br>
`npm install`<br>

- For the consumer service<br>
`cd ../openmusic-v3-consumer`<br>
`npm install`<br>

### 4. Run Database Migrations
From the openmusic-api-v3 directory, run the database migrations to set up the required tables:<br>
`cd openmusic-api-v3`<br>
`npm run migrate up`<br>

### 5. Running the Application
#### You need to run both the API server and the consumer in separate terminals.<br>
- Start the API Server (from openmusic-api-v3 directory):<br>
`npm run start-dev`<br>
#### The server will be available at http://localhost:5000.
- Start the Consumer Service (from openmusic-v3-consumer directory):<br>
`node src/consumer.js`<br>

## 🛠️ Technologies & Tools
- Back-End: Node.js
- Framework: Hapi.js
- Database: PostgreSQL
- Caching: Redis
- Message Broker: RabbitMQ
- Authentication: JSON Web Tokens (JWT)
- Libraries: pg (PostgreSQL Client), bcrypt (Password Hashing), nanoid (Unique ID Generation), joi (Validation), amqplib (RabbitMQ Client), nodemailer (Email Sending)
- Development Tools: ESLint, Nodemon.

## ⭐ Final Result: 4 Stars
![WhatsApp Image 2025-09-15 at 22 38 52_9eebf288](https://github.com/user-attachments/assets/08a1074b-2ba3-4d7f-8ef6-db29d6d355cc)
<img width="409" height="622" alt="image" src="https://github.com/user-attachments/assets/6d10f548-2e86-4c16-9752-a453b69218cf" />


This project did not pass all submission criteria, and therefore only received a rating of 4 out of 5 stars.

**Reviewer's Note for Future Improvement:**
Unfortunately, the reviewer noted that ESLint was not implemented in this project. To ensure consistent JavaScript code style, it is recommended to use ESLint and adopt conventions such as Dicoding Academy JavaScript Style Guide, AirBnB, or Google JavaScript Style Guide.


## ⭐ Special Thanks
A big thank you to Dicoding Indonesia for creating an excellent and challenging learning platform. The "Belajar Fundamental Back-End dengan JavaScript" course was an invaluable experience, pushing me through multiple revisions and debugging sessions to master complex concepts like message brokering, caching, and secure API design.

## ⚠️ Disclaimer
This repository is the result of a final project submission for the "Belajar Fundamental Back-End dengan JavaScript" course at Dicoding Academy. Please use this code as a reference for learning purposes only.

**Do not copy and paste this project for your own submission.** Plagiarism is strictly prohibited by Dicoding and will be detected.
