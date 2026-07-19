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
      parameters: {
        TaskId: {
          name: "id",
          in: "path",
          required: true,
          description: "MongoDB task ID",
          schema: {
            type: "string",
            pattern: "^[a-fA-F0-9]{24}$",
            example: "507f1f77bcf86cd799439011",
          },
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
        UserResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/User" },
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
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "507f1f77bcf86cd799439011" },
            title: { type: "string", example: "Finish project report" },
            description: { type: "string", example: "Review and submit the final report." },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              example: "pending",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },
            dueDate: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title", "status", "dueDate"],
          properties: {
            title: { type: "string", minLength: 4, maxLength: 100 },
            description: { type: "string", maxLength: 1000, default: "" },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              default: "medium",
            },
            status: {
              type: "string",
              enum: ["pending", "completed"],
              example: "pending",
            },
            dueDate: { type: "string", format: "date-time" },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            title: { type: "string", minLength: 4, maxLength: 100 },
            description: { type: "string", maxLength: 1000 },
            status: {
              type: "string",
              enum: ["pending", "completed"],
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
            },
            dueDate: { type: "string", format: "date-time" },
          },
        },
        UpdateTaskStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["pending", "completed"],
            },
          },
        },
        TaskResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                task: { $ref: "#/components/schemas/Task" },
              },
            },
          },
        },
        TaskListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                tasks: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Task" },
                },
                count: { type: "integer", example: 1 },
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    total: { type: "integer", example: 24 },
                    totalPages: { type: "integer", example: 3 },
                    hasNextPage: { type: "boolean", example: true },
                    hasPreviousPage: { type: "boolean", example: false },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [routeFiles],
});

export default swaggerSpec;
