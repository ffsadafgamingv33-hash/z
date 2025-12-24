import { z } from "zod";
import { insertUserSchema, insertItemSchema, insertTransactionSchema, insertTicketSchema } from "./schema";

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register",
      input: insertUserSchema,
      responses: {
        201: z.object({ _id: z.string(), id: z.string().optional(), username: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ _id: z.string(), username: z.string(), role: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/user",
      responses: {
        200: z.object({ _id: z.string(), username: z.string(), role: z.string(), credits: z.number() }).nullable(),
      },
    },
  },
  items: {
    list: {
      method: "GET" as const,
      path: "/api/items",
      responses: {
        200: z.array(z.any()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/items",
      input: insertItemSchema.extend({
        contents: z.array(z.string()).optional(),
      }),
      responses: {
        201: z.any(),
        403: errorSchemas.unauthorized,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/items/:id",
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/items/:id",
      responses: {
        200: z.object({ message: z.string() }),
        403: errorSchemas.unauthorized,
      },
    },
    purchase: {
      method: "POST" as const,
      path: "/api/items/:id/purchase",
      responses: {
        200: z.object({ message: z.string(), content: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
  transactions: {
    list: {
      method: "GET" as const,
      path: "/api/transactions",
      responses: {
        200: z.array(z.any()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/transactions",
      input: insertTransactionSchema,
      responses: {
        201: z.any(),
      },
    },
    approve: {
      method: "POST" as const,
      path: "/api/transactions/:id/approve",
      responses: {
        200: z.any(),
        403: errorSchemas.unauthorized,
      },
    },
    reject: {
      method: "POST" as const,
      path: "/api/transactions/:id/reject",
      responses: {
        200: z.any(),
        403: errorSchemas.unauthorized,
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/transactions/:id",
      input: z.object({ amount: z.number() }),
      responses: {
        200: z.any(),
        403: errorSchemas.unauthorized,
      },
    },
  },
  codes: {
    generate: {
      method: "POST" as const,
      path: "/api/codes",
      input: z.object({ value: z.number(), count: z.number().default(1) }),
      responses: {
        201: z.array(z.any()),
        403: errorSchemas.unauthorized,
      },
    },
    redeem: {
      method: "POST" as const,
      path: "/api/codes/redeem",
      input: z.object({ code: z.string() }),
      responses: {
        200: z.object({ message: z.string(), value: z.number() }),
        400: errorSchemas.validation,
      },
    },
  },
  tickets: {
    list: {
      method: "GET" as const,
      path: "/api/tickets",
      responses: {
        200: z.array(z.any()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/tickets",
      input: insertTicketSchema,
      responses: {
        201: z.any(),
      },
    },
    reply: {
      method: "POST" as const,
      path: "/api/tickets/:id/reply",
      input: z.object({ reply: z.string() }),
      responses: {
        200: z.any(),
        403: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
