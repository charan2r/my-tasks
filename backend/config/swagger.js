import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const routeFiles = path
  .join(currentDirectory, "../routes/*.js")
  .replaceAll("\\", "/");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "REST API for task management.",
    },
    servers: [
      {
        url: "/api/v1",
        description: "Version 1 API",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "Jane Doe" },
            email: {
              type: "string",
              format: "email",
              example: "jane@example.com",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 4,
              maxLength: 20,
              example: "Jane Doe",
            },
            email: {
              type: "string",
              format: "email",
              maxLength: 50,
              example: "jane@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              maxLength: 20,
              example: "StrongPass123",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "jane@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "StrongPass123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/User" },
                token: { type: "string" },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
        ValidationErrorResponse: {
          allOf: [
            { $ref: "#/components/schemas/ErrorResponse" },
            {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string", example: "email" },
                      message: {
                        type: "string",
                        example: "Enter a valid email address.",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
  apis: [routeFiles],
});

export default swaggerSpec;
