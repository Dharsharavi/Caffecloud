# ☕ CaffeCloud

**CaffeCloud** is a fully serverless CRUD application for managing a coffee shop's menu — built entirely on AWS. It lets you create, read, update, and delete coffee items through a REST API backed by Lambda and DynamoDB, with a React frontend to manage everything visually. The project also ships an authenticated variant secured with Amazon Cognito.

![AWS Serverless Architecture](https://github.com/user-attachments/assets/98a368e1-1974-4f91-9488-e69c6f122af5)

---

## ✨ Features

- **Full CRUD API** for coffee items (`coffeeId`, `name`, `price`, `available`) via API Gateway + Lambda
- **DynamoDB** as a fully managed, serverless NoSQL data store
- **React (Vite) frontend** to list, add, view, edit, and delete coffee items
- **Optional authentication** with Amazon Cognito (OIDC) — a ready-to-use `FrontendWithAuth` variant that attaches a Bearer token to every request
- **Lambda Layers support** — shared DynamoDB client/helper code extracted into a reusable layer to keep function bundles small
- **Two Lambda runtimes** — modern ES Modules (`.mjs`) implementation and a CommonJS (`.js`) implementation for teams that prefer `require`
- **Static hosting ready** — sample S3 bucket policy for serving the frontend behind CloudFront

---

## 🏗️ Architecture

```
React (Vite) SPA  ──HTTPS──▶  API Gateway  ──▶  Lambda (per operation)  ──▶  DynamoDB
      │                                              │
      ▼                                              ▼
  CloudFront + S3                              CloudWatch Logs
  (static hosting)                        (via IAM execution role)

Optional: React SPA ──▶ Amazon Cognito (OIDC login) ──Bearer token──▶ API Gateway
```

- **Amazon API Gateway** exposes REST endpoints and routes each HTTP method to its own Lambda function.
- **AWS Lambda** (Node.js) contains one function per operation — `post`, `get`, `update`, `delete` — each using the AWS SDK v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`).
- **Amazon DynamoDB** stores coffee items in a single table, keyed by `coffeeId`.
- **Amazon S3 + CloudFront** (optional) serve the built React app as a static site, restricted via a CloudFront Origin Access Identity/Control bucket policy.
- **Amazon Cognito** (optional, `FrontendWithAuth`) issues OIDC tokens; the frontend attaches them as `Authorization: Bearer <token>` headers, and API Gateway/Lambda can be configured with a Cognito authorizer.

---

## 📁 Project Structure

```
AWS-CRUD-Serverless-main/
├── Lambda Functions/              # ES Module (.mjs) Lambda handlers — no layer dependency
│   ├── post/index.mjs             # Create a coffee item
│   ├── get/index.mjs              # Get one item (by id) or scan all items
│   ├── update/index.mjs           # Update an existing item
│   └── delete/index.mjs           # Delete an item
│
├── CommonJS-LambdaCode/           # Same functions written in CommonJS (.js)
│   ├── Lambda Functions/          # Standalone CommonJS handlers
│   └── Layers/                    # CommonJS handlers using a shared Lambda Layer
│
├── Layers/                        # ES Module Lambda Layer (shared DynamoDB client + helpers)
│   ├── nodejs/utils.mjs           # Exports docClient, createResponse, and DynamoDB commands
│   ├── LambdaFunctionsWithLayer/  # Thin handlers that import from the layer
│   └── create_zip.sh              # Script to package the layer and function zips
│
├── policy/
│   ├── Lambda IAM Role Policy.txt # Least-privilege IAM policy for the Lambda execution role
│   └── S3 Bucket Policy.txt       # Bucket policy restricting access to a CloudFront distribution
│
├── frontend/                      # React (Vite) SPA — no authentication
│   ├── src/App.jsx                 # Coffee list + add-item form
│   ├── src/ItemDetails.jsx         # View/edit/delete a single item
│   └── src/utils/apis.js           # Fetch wrappers for the CRUD API
│
├── FrontendWithAuth/               # Same SPA, secured with Amazon Cognito (react-oidc-context)
│   ├── src/App.jsx                 # Sign-in/sign-out flow via Cognito Hosted UI
│   ├── src/Home.jsx                # Authenticated coffee list + add-item form
│   └── src/utils/apis.js           # Fetch wrappers that attach a Bearer access token
│
└── README.md
```

---

## 🧰 Tech Stack

| Layer           | Technology                                             |
| --------------- | ------------------------------------------------------ |
| Frontend        | React 19, Vite, React Router                           |
| Auth (optional) | Amazon Cognito, `react-oidc-context`, `oidc-client-ts` |
| API             | Amazon API Gateway                                     |
| Compute         | AWS Lambda (Node.js, AWS SDK v3)                       |
| Database        | Amazon DynamoDB                                        |
| Hosting         | Amazon S3 + Amazon CloudFront                          |
| IAM             | Custom least-privilege execution role policy           |

---

## 🔌 API Reference

Base URL comes from your API Gateway deployment (see `VITE_API_URL` below).

| Method | Path           | Description                                   | Body / Params                                           |
| ------ | -------------- | --------------------------------------------- | ------------------------------------------------------- |
| POST   | `/coffee`      | Create a new coffee item                      | `{ coffeeId, name, price, available }`                  |
| GET    | `/coffee`      | List all coffee items                         | —                                                       |
| GET    | `/coffee/{id}` | Get a single coffee item                      | Path param: `id`                                        |
| PUT    | `/coffee/{id}` | Update a coffee item (partial update allowed) | Path param: `id`; body: any of `name, price, available` |
| DELETE | `/coffee/{id}` | Delete a coffee item                          | Path param: `id`                                        |

**Notes on behavior:**

- `POST` returns `409` if `coffeeId` already exists or if required fields are missing.
- `PUT` / `DELETE` return `404` if the item does not exist (enforced via DynamoDB `ConditionExpression`).
- `GET /coffee` (no id) performs a full table `Scan`; `GET /coffee/{id}` performs a `GetItem`.

---

## 🔐 Security Notes

- The provided IAM policy follows least privilege — Lambda can only perform the five DynamoDB actions it needs, plus writing its own logs.
- The S3 bucket policy denies public access and only allows reads from the specified CloudFront distribution.
- The authenticated frontend stores the OIDC session in `sessionStorage` (cleared on sign-out) rather than `localStorage`, and sends the access token as a Bearer header on every API call.

---
