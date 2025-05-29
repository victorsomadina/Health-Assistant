export default {
  openapi: "3.0.0",
  info: {
    title: "WEHELP HealthCare API",
    version: "1.0.0",
    description: "An API to interact with the Publica Academy database",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/admin/changepassword": {
      post: {
        summary: "Change admin password",
        tags: ["Admin"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint allows an admin to change their password by providing the current password and a new password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "admin@publicaacademy.com",
                    description: "Admin's email address",
                  },
                  oldPassword: {
                    type: "string",
                    example: "currentPassword123",
                    description: "Current password",
                  },
                  newPassword: {
                    type: "string",
                    example: "newSecurePassword456",
                    description: "New password to set",
                  },
                },
                required: ["email", "oldPassword", "newPassword"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password changed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password changed successfully",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid old password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid old password",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Admin not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error changing password",
                    },
                    error: {
                      type: "object",
                      description: "Error details",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/login": {
      post: {
        summary: "Admin authentication",
        tags: ["Admin"],
        description:
          "This endpoint allows an admin to authenticate and receive a JWT token for accessing protected resources.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "admin@publicaacademy.com",
                    description: "Admin's email address",
                  },
                  password: {
                    type: "string",
                    example: "adminPassword123",
                    description: "Admin's password",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                      description: "JWT authentication token",
                    },
                    message: {
                      type: "string",
                      example: "Login successful",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request - Missing required fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email and password are required",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid credentials",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Admin not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error during login",
                    },
                    error: {
                      type: "object",
                      description: "Error details (only in development mode)",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/admin/signupdoctor/{id}": {
      post: {
        summary: "Register a new doctor",
        tags: ["Admin"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint allows registration of a new doctor to a specific hospital. The doctor will receive a welcome email after successful registration.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Hospital ID to associate the doctor with",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Dr. John Smith",
                    description: "Doctor's full name",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "dr.johnsmith@hospital.com",
                    description: "Doctor's email address",
                  },
                  password: {
                    type: "string",
                    example: "securePassword123",
                    description: "Doctor's password (will be hashed)",
                  },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Doctor created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor created successfully",
                    },
                    doctor: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                        },
                        hospitalId: {
                          type: "integer",
                          example: 1,
                        },
                        name: {
                          type: "string",
                          example: "Dr. John Smith",
                        },
                        email: {
                          type: "string",
                          example: "dr.johnsmith@hospital.com",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-05-28T10:30:00.000Z",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-05-28T10:30:00.000Z",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request - Missing required fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Missing required fields",
                    },
                    error: {
                      type: "object",
                      properties: {
                        name: {
                          type: "boolean",
                          example: false,
                        },
                        email: {
                          type: "boolean",
                          example: true,
                        },
                        password: {
                          type: "boolean",
                          example: false,
                        },
                        hospitalId: {
                          type: "boolean",
                          example: false,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Hospital not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Hospital not found",
                    },
                    error: {
                      type: "object",
                      properties: {
                        hospitalId: {
                          type: "string",
                          example: "1",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "Conflict - Doctor already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor already exists",
                    },
                    error: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string",
                          example: "dr.johnsmith@hospital.com",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error creating doctor",
                    },
                    error: {
                      type: "object",
                      description: "Error details (only in development mode)",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/patient/audiotranscribe/{id}": {
      post: {
        summary: "Transcribe audio conversation",
        tags: ["User"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint transcribes an audio file containing a conversation between a patient and doctor, then stores the transcription in the conversation records.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Patient ID for the conversation record",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  doctorName: {
                    type: "string",
                    example: "Dr. John Smith",
                    description:
                      "Name of the doctor involved in the conversation",
                  },
                  audioFile: {
                    type: "string",
                    format: "binary",
                    description:
                      "Audio file to be transcribed (supported formats: mp3, wav, m4a, etc.)",
                  },
                },
                required: ["doctorName", "audioFile"],
              },
            },
          },
        },
        responses: {
          201: {
            description:
              "Audio transcribed successfully and conversation record created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Audio transcribed successfully",
                    },
                    conversation: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                          description: "Conversation record ID",
                        },
                        patientId: {
                          type: "integer",
                          example: 1,
                          description: "Patient ID",
                        },
                        doctorId: {
                          type: "integer",
                          example: 1,
                          description: "Doctor ID",
                        },
                        transcription: {
                          type: "string",
                          example:
                            "Doctor: How are you feeling today? Patient: I've been experiencing some chest pain...",
                          description: "Transcribed conversation text",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-05-28T10:30:00.000Z",
                          description: "Timestamp when the record was created",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request - No audio file provided",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No audio file provided",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Doctor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error - Transcription failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error during transcription",
                    },
                    error: {
                      type: "object",
                      description: "Error details",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/patient/getpatient/{id}": {
      get: {
        summary: "Get patient by ID",
        tags: ["User"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint retrieves a specific patient's information by their ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Patient ID to retrieve",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        responses: {
          200: {
            description: "Patient retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                      description: "Patient's unique identifier",
                    },
                    name: {
                      type: "string",
                      example: "John Doe",
                      description: "Patient's full name",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john.doe@email.com",
                      description: "Patient's email address",
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      example: "2025-05-28T10:30:00.000Z",
                      description:
                        "Timestamp when the patient record was created",
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                      example: "2025-05-28T10:30:00.000Z",
                      description:
                        "Timestamp when the patient record was last updated",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Patient not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error retrieving patient data",
                    },
                    error: {
                      type: "object",
                      description: "Error details",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/patient/deletepatient/{id}": {
      delete: {
        summary: "Delete patient profile",
        tags: ["User"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint permanently deletes a patient's profile from the system. This action cannot be undone and will remove all associated patient data.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Patient ID to delete",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        responses: {
          200: {
            description: "Patient profile deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient profile deleted successfully",
                      description: "Success message confirming deletion",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Patient not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient not found",
                      description: "Error message when patient doesn't exist",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error deleting patient profile",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "DATABASE_ERROR",
                        details: "Connection timeout",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/patient/login": {
      post: {
        summary: "Patient login authentication",
        tags: ["User"],
        description:
          "This endpoint authenticates a patient using email and password credentials. Returns a JWT token upon successful authentication.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "patient@email.com",
                    description: "Patient's email address",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "password123",
                    description: "Patient's password",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlclR5cGUiOiJwYXRpZW50IiwiaWF0IjoxNjM5NTY3ODkwLCJleHAiOjE2Mzk2NTQyOTB9.xyz",
                      description: "JWT authentication token",
                    },
                    message: {
                      type: "string",
                      example: "Login successful",
                      description: "Success message confirming authentication",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid password",
                      description: "Error message for incorrect password",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Patient not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient not found",
                      description: "Error message when patient doesn't exist",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error during login",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "JWT_ERROR",
                        details: "Token generation failed",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/patient/signup": {
      post: {
        summary: "Patient registration",
        tags: ["User"],
        description:
          "This endpoint registers a new patient in the system. It validates that the email is unique, hashes the password, and creates a new patient record.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "John Doe",
                    description: "Patient's full name",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john.doe@email.com",
                    description: "Patient's email address (must be unique)",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "password123",
                    description: "Patient's password (will be hashed)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Patient registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient registered successfully",
                      description: "Success message confirming registration",
                    },
                    patient: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                          description: "Patient's unique identifier",
                        },
                        name: {
                          type: "string",
                          example: "John Doe",
                          description: "Patient's full name",
                        },
                        email: {
                          type: "string",
                          format: "email",
                          example: "john.doe@email.com",
                          description: "Patient's email address",
                        },
                      },
                      description:
                        "Created patient information (password excluded)",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Patient already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient already exists",
                      description:
                        "Error message when email is already registered",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error during signup",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "DATABASE_ERROR",
                        details: "Unable to create patient record",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/superadmin/login": {
      post: {
        summary: "Super Admin login authentication",
        tags: ["Super Admin"],
        description:
          "This endpoint authenticates a super admin using email and password credentials. Returns a JWT token with superadmin role upon successful authentication.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "superadmin@admin.com",
                    description: "Super Admin's email address",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "adminpassword123",
                    description: "Super Admin's password",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTYzOTU2Nzg5MCwiZXhwIjoxNjM5NjU0MjkwfQ.xyz",
                      description:
                        "JWT authentication token with superadmin role",
                    },
                    message: {
                      type: "string",
                      example: "Login successful",
                      description: "Success message confirming authentication",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid password",
                      description: "Error message for incorrect password",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Super Admin not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Super Admin not found",
                      description:
                        "Error message when super admin doesn't exist",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error comparing passwords",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "BCRYPT_ERROR",
                        details: "Password comparison failed",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/superadmin/signupadmin": {
      post: {
        summary: "Admin registration",
        tags: ["Super Admin"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint registers a new hospital admin in the system. It validates that the email is unique, creates the admin account, sends login credentials via email, and returns the admin information. This endpoint is typically restricted to super admins.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "hospitalName", "password", "location"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "admin@hospital.com",
                    description: "Admin's email address (must be unique)",
                  },
                  hospitalName: {
                    type: "string",
                    minLength: 2,
                    maxLength: 200,
                    example: "City General Hospital",
                    description: "Name of the hospital the admin manages",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "adminpassword123",
                    description:
                      "Admin's password (will be hashed and sent via email)",
                  },
                  location: {
                    type: "string",
                    minLength: 2,
                    maxLength: 200,
                    example: "New York, NY",
                    description: "Hospital location or admin's location",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Admin created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin created successfully",
                      description: "Success message confirming admin creation",
                    },
                    admin: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                          description: "Admin's unique identifier",
                        },
                        email: {
                          type: "string",
                          format: "email",
                          example: "admin@hospital.com",
                          description: "Admin's email address",
                        },
                        hospitalName: {
                          type: "string",
                          example: "City General Hospital",
                          description: "Name of the hospital",
                        },
                        location: {
                          type: "string",
                          example: "New York, NY",
                          description: "Hospital or admin location",
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-05-28T10:30:00.000Z",
                          description: "Timestamp when the admin was created",
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-05-28T10:30:00.000Z",
                          description:
                            "Timestamp when the admin was last updated",
                        },
                      },
                      description:
                        "Created admin information (password excluded for security)",
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "Admin already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Admin already exists",
                      description:
                        "Error message when admin email is already registered",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error creating admin",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "DATABASE_ERROR",
                        details: "Unable to create admin record",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/practitioner/changepassword/{id}": {
      post: {
        summary: "Change doctor password",
        tags: ["Doctor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint allows a doctor to change their password by providing their current password and a new password. The old password is verified before updating to the new hashed password.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Doctor ID whose password needs to be changed",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["oldPassword", "newPassword"],
                properties: {
                  oldPassword: {
                    type: "string",
                    minLength: 6,
                    example: "oldpassword123",
                    description: "Doctor's current password for verification",
                  },
                  newPassword: {
                    type: "string",
                    minLength: 6,
                    example: "newpassword456",
                    description: "New password to set (will be hashed)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password changed successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password changed successfully",
                      description: "Success message confirming password update",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid old password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid old password",
                      description:
                        "Error message when current password verification fails",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Doctor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor not found",
                      description: "Error message when doctor doesn't exist",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error changing password",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "DATABASE_ERROR",
                        details: "Unable to update password",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/practitioner/login": {
      post: {
        summary: "Doctor login",
        tags: ["Doctor"],
        description:
          "Allows a doctor to log in by providing email and password. Returns a JWT token upon successful authentication.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "doctor@example.com",
                    description: "Doctor's email address",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "strongpassword123",
                    description: "Doctor's password",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Login successful",
                    },
                    token: {
                      type: "string",
                      description: "JWT token for authentication",
                    },
                    doctor: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                        },
                        name: {
                          type: "string",
                          example: "Dr. John Doe",
                        },
                        email: {
                          type: "string",
                          format: "email",
                          example: "doctor@example.com",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid password",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Doctor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error during login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error during login",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "INTERNAL_SERVER_ERROR",
                        details: "Error details",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/practitioner/updateprofile/{id}": {
      post: {
        summary: "Update doctor profile",
        tags: ["Doctor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint allows a doctor to update their profile details such as location, date of birth, consent for recording, professional description, field, and years of experience.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Doctor ID whose profile needs to be updated",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  location: {
                    type: "string",
                    example: "New York",
                    description: "Doctor's location",
                  },
                  DOB: {
                    type: "string",
                    format: "date",
                    example: "1980-05-15",
                    description: "Doctor's date of birth",
                  },
                  recordConsent: {
                    type: "boolean",
                    example: true,
                    description: "Consent to record patient sessions",
                  },
                  professionalDescription: {
                    type: "string",
                    example:
                      "Experienced cardiologist with 10 years in practice",
                    description: "Professional description of the doctor",
                  },
                  field: {
                    type: "string",
                    example: "Cardiology",
                    description: "Medical field or specialty",
                  },
                  yearsOfExperience: {
                    type: "integer",
                    example: 10,
                    description: "Years of professional experience",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Doctor profile updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor profile updated successfully",
                      description: "Success message confirming profile update",
                    },
                    doctor: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          example: 1,
                        },
                        name: {
                          type: "string",
                          example: "Dr. John Doe",
                        },
                        email: {
                          type: "string",
                          format: "email",
                          example: "doctor@example.com",
                        },
                        location: {
                          type: "string",
                          example: "New York",
                        },
                        DOB: {
                          type: "string",
                          format: "date",
                          example: "1980-05-15",
                        },
                        recordConsent: {
                          type: "boolean",
                          example: true,
                        },
                        professionalDescription: {
                          type: "string",
                          example:
                            "Experienced cardiologist with 10 years in practice",
                        },
                        field: {
                          type: "string",
                          example: "Cardiology",
                        },
                        yearsOfExperience: {
                          type: "integer",
                          example: 10,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Doctor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor not found",
                      description: "Error message when doctor doesn't exist",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error updating profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error updating profile",
                      description: "Error message describing the failure",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "INTERNAL_SERVER_ERROR",
                        details: "Error details",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/practitioner/doctors": {
      get: {
        summary: "Get all doctors",
        tags: ["Doctor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "Fetches a list of all doctors with their profile details.",
        responses: {
          200: {
            description: "Doctors retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctors retrieved successfully",
                    },
                    doctors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 1 },
                          name: { type: "string", example: "Dr. Jane Smith" },
                          email: {
                            type: "string",
                            format: "email",
                            example: "jane.smith@example.com",
                          },
                          location: { type: "string", example: "New York" },
                          DOB: {
                            type: "string",
                            format: "date",
                            example: "1975-07-20",
                          },
                          professionalDescription: {
                            type: "string",
                            example: "Experienced pediatrician",
                          },
                          field: { type: "string", example: "Pediatrics" },
                          yearsOfExperience: { type: "integer", example: 15 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "No doctors found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No doctors found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error retrieving doctors",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error retrieving doctors",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "DATABASE_ERROR",
                        details: "Error details",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/practitioner/doctors/{id}": {
      get: {
        summary: "Get doctor by ID",
        tags: ["Doctor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: "Fetch a single doctor's profile details by their ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Doctor ID to retrieve",
            schema: {
              type: "string",
              example: "1",
            },
          },
        ],
        responses: {
          200: {
            description: "Doctor retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor retrieved successfully",
                    },
                    doctor: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Dr. John Doe" },
                        email: {
                          type: "string",
                          format: "email",
                          example: "john.doe@example.com",
                        },
                        location: { type: "string", example: "Los Angeles" },
                        DOB: {
                          type: "string",
                          format: "date",
                          example: "1980-05-15",
                        },
                        professionalDescription: {
                          type: "string",
                          example: "Cardiologist with 20 years of experience",
                        },
                        field: { type: "string", example: "Cardiology" },
                        yearsOfExperience: { type: "integer", example: 20 },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Doctor not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Doctor not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error retrieving doctor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error retrieving doctor",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        code: "DATABASE_ERROR",
                        details: "Error details",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
