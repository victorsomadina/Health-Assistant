export default {
  openapi: "3.0.0",
  info: {
    title: "WEHELP HealthCare API",
    version: "1.0.0",
    description: "An API to interact with the weHelp healthcare database",
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
    "/api/login": {
      post: {
        summary: "Login for all user roles",
        tags: ["Authentication"],
        description:
          "This endpoint allows Superadmin, Admin, Doctor, or Patient to log in using email and password. The role is auto-detected based on the email.",
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
                    example: "user@example.com",
                    description: "User's email address",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                    description: "User's login password",
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
                      description: "JWT token for authenticated access",
                    },
                    message: {
                      type: "string",
                      example: "Admin login successful",
                    },
                    adminData: {
                      type: "object",
                      nullable: true,
                      description: "Returned if logged-in user is an admin",
                    },
                    doctorData: {
                      type: "object",
                      nullable: true,
                      description: "Returned if logged-in user is a doctor",
                    },
                    patientData: {
                      type: "object",
                      nullable: true,
                      description: "Returned if logged-in user is a patient",
                    },
                    superAdminData: {
                      type: "object",
                      nullable: true,
                      description: "Returned if logged-in user is a superadmin",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid email or password",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Internal server error",
                    },
                    error: {
                      type: "string",
                      example: "Detailed error message",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
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
                  gender: {
                    type: "string",
                    example: "Male",
                    description: "Doctor gender",
                  },
                  date_of_birth: {
                    type: "string",
                    format: "date",
                    example: "1980-05-15",
                    description: "Doctor's date of birth",
                  },
                  record_consent: {
                    type: "boolean",
                    example: true,
                    description: "Consent to record patient sessions",
                  },
                  professional_description: {
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
                  years_of_experience: {
                    type: "integer",
                    example: 10,
                    description: "Years of professional experience",
                  },
                  phone: {
                    type: "string",
                    example: "+1234567890",
                    description: "Doctor's contact phone number",
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
    "/api/patient/doctors": {
      get: {
        summary: "Get all doctors",
        tags: ["User"],
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
    "/api/patient/updateprofile/{id}": {
      post: {
        summary: "Update patient profile",
        tags: ["User"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: "Update a single patient's profile details by their ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Patient ID to update",
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
                    example: "Lagos",
                  },
                  gender: {
                    type: "string",
                    example: "Female",
                  },
                  date_of_birth: {
                    type: "string",
                    format: "date",
                    example: "1990-03-15",
                  },
                  phone: {
                    type: "string",
                    example: "+2348012345678",
                  },
                  known_allergies: {
                    type: "text",
                    example: "peanuts",
                  },
                  chronic_conditions: {
                    type: "text",
                    example: "asthma",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Patient Profile Updated Successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patient Profile Updated Successfully",
                    },
                    patient: {
                      type: "object",
                      properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Jane Doe" },
                        gender: { type: "string", example: "Female" },
                        email: {
                          type: "string",
                          format: "email",
                          example: "jane.doe@example.com",
                        },
                        location: { type: "string", example: "Lagos" },
                        age: { type: "integer", example: 34 },
                        known_allergies: {
                          type: "object",
                          example: { peanuts: true },
                        },
                        chronic_conditions: {
                          type: "object",
                          example: { asthma: true },
                        },
                        phone: { type: "string", example: "+2348012345678" },
                      },
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
                      example: "Doctor not found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error updating patient",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error updating profile",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        name: "SequelizeDatabaseError",
                        message: "Invalid input syntax for type date",
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
    "/api/assistant/gethospital": {
      get: {
        summary: "Get all hospitals",
        tags: ["AI Assistant"],
        description:
          "Fetch a list of all registered hospitals with their names and locations.",
        responses: {
          200: {
            description: "Hospitals retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hospitals: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          hospitalName: {
                            type: "string",
                            example: "St. Mary Hospital",
                          },
                          location: {
                            type: "string",
                            example: "Abuja",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "No hospitals found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No hospitals found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error retrieving hospital data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error retrieving hospital data",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        name: "SequelizeConnectionError",
                        message: "Database connection failed",
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
    "/api/assistant/getdoctorbyhospital": {
      post: {
        summary: "Get doctors by hospital name",
        tags: ["AI Assistant"],
        description:
          "Fetch all doctors associated with a specific hospital, given the hospital name.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  hospitalName: {
                    type: "string",
                    example: "St. Mary Hospital",
                  },
                },
                required: ["hospitalName"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Doctors retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    doctors: {
                      type: "array",
                      items: {
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
                          location: {
                            type: "string",
                            example: "Abuja",
                          },
                          field: {
                            type: "string",
                            example: "Cardiology",
                          },
                          professionalDescription: {
                            type: "string",
                            example:
                              "Expert in cardiovascular surgery with 15 years of experience",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Hospital or doctors not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No doctors found for this hospital",
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
                        name: "SequelizeDatabaseError",
                        message: "Invalid query syntax",
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
    "/api/assistant/chatassistant": {
      post: {
        summary: "Query AI Assistant",
        tags: ["AI Assistant"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint allows a logged-in doctor or patient to query an AI assistant using their past conversation transcripts.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                    example:
                      "What medications were discussed in our last session?",
                  },
                  converse: {
                    type: "boolean",
                    example: true,
                  },
                  doctorName: {
                    type: "string",
                    example: "Dr. John Doe",
                  },
                  patientName: {
                    type: "string",
                    example: "Jane Smith",
                  },
                },
                required: ["question"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Assistant responded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    airesponse: {
                      type: "object",
                      description: "The response from the assistant AI",
                      example: {
                        answer:
                          "Based on the last conversation, aspirin and amlodipine were discussed.",
                        sources: ["transcript snippet here"],
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Transcript or user not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No transcript found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error processing request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error fetching transcript",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        name: "FetchError",
                        message: "Failed to fetch data from Assistant API",
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
    "/api/practitioner/patients": {
      get: {
        summary: "Retrieve Patients for Logged-in Doctor",
        tags: ["Doctor"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          "This endpoint allows a logged-in doctor to retrieve a list of patients they have interacted with via recorded conversations.",
        responses: {
          200: {
            description: "Patients retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Patients retrieved successfully",
                    },
                    patients: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          doctorId: {
                            type: "integer",
                            example: 42,
                          },
                          patientId: {
                            type: "integer",
                            example: 17,
                          },
                          patient: {
                            type: "object",
                            properties: {
                              id: {
                                type: "integer",
                                example: 17,
                              },
                              name: {
                                type: "string",
                                example: "Jane Smith",
                              },
                              email: {
                                type: "string",
                                example: "jane.smith@example.com",
                              },
                              location: {
                                type: "string",
                                example: "Lagos, Nigeria",
                              },
                              DOB: {
                                type: "string",
                                format: "date",
                                example: "1990-05-14",
                              },
                              knownAllergies: {
                                type: "string",
                                example: "Penicillin",
                              },
                              chronicConditions: {
                                type: "string",
                                example: "Asthma",
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
          404: {
            description: "No patients found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "No patients found",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error retrieving patients",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Error retrieving patients",
                    },
                    error: {
                      type: "object",
                      description: "Detailed error information",
                      additionalProperties: true,
                      example: {
                        name: "SequelizeDatabaseError",
                        message:
                          "Invalid table reference or DB connection issue",
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
