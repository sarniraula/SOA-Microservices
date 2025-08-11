SOA Project - Microservices Application

This project is a microservices-based application simulating a real-world use case. It consists of multiple independent services designed with Node.js and MongoDB, containerized with Docker, and orchestrated with Kubernetes.

---

## Project Overview

- **Microservices:** User Service, Product Service, Order Service  
- **Tech Stack:** Node.js, Express, MongoDB, Docker, Kubernetes  
- **Features:**  
  - RESTful APIs for each service  
  - Containerized services with Docker  
  - Local multi-container setup with Docker Compose  
  - Kubernetes deployment for orchestration and scaling  
  - Communication between services using HTTP calls  
  - CI/CD pipeline (planned) for automated build, test, and deployment

---

## Folder Structure
---

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker & Docker Compose
- Kubernetes (Minikube, Kind, or Docker Desktop with Kubernetes enabled)
- kubectl CLI tool
- Git

### Running Locally with Docker Compose

```bash
# From the root project folder
docker-compose up --build
```

Services will be accessible at:

```bash
User Service: http://localhost:3001

Product Service: http://localhost:3002

Order Service: http://localhost:3003
```
Running on Kubernetes (Local Cluster)
Start your Kubernetes cluster (e.g., minikube start).

Apply MongoDB StatefulSet:

```
kubectl apply -f kubernetes/mongodb-statefulset.yaml
```
Deploy microservices:
```
kubectl apply -f kubernetes/user-deployment.yaml
kubectl apply -f kubernetes/product-deployment.yaml
kubectl apply -f kubernetes/order-deployment.yaml
```
Verify pods and services:
```
kubectl get pods
kubectl get svc
```
## APIs

### User Service

GET /users - Get all users

GET /users/:id - Get user by ID

POST /users - Create user

PUT /users/:id - Update user

DELETE /users/:id - Delete user

### Product Service
GET /products - Get all products

GET /products/:id - Get product by ID

POST /products - Create product

PUT /products/:id - Update product

DELETE /products/:id - Delete product

### Order Service
GET /orders - Get all orders

GET /orders/:id - Get order by ID

POST /orders - Create order (supports multiple products)

PUT /orders/:id - Update order status

DELETE /orders/:id - Delete order

### Notes
Environment variables for MongoDB URIs are configured inside deployment files and Docker Compose.

Make sure to configure your .env files for local development (not included in repo for security).

### Future Enhancements
CI/CD pipeline integration with GitHub Actions.

Add monitoring with Prometheus and Grafana.

Implement authentication and API Gateway.

Centralized logging and tracing.// test commit
