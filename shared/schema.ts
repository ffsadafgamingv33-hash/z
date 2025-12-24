import { z } from "zod";

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  role: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface User {
  _id: string;
  id?: number;
  username: string;
  password: string;
  role: string;
  credits: number;
  createdAt: Date;
}

export interface Item {
  _id: string;
  id?: number;
  title: string;
  description: string;
  price: number;
  type: string;
  content?: string;
  contents?: string[];
  createdAt: Date;
}

export const insertItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  type: z.string(),
  content: z.string().optional(),
  contents: z.array(z.string()).optional(),
});

export type InsertItem = z.infer<typeof insertItemSchema>;

export interface ItemContent {
  _id: string;
  itemId: string;
  pageNumber: number;
  content: string;
}

export interface Purchase {
  _id: string;
  userId: string;
  itemId: string;
  purchasedAt: Date;
  contentDelivered?: string;
}

export interface Transaction {
  _id: string;
  id?: number;
  userId: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

export const insertTransactionSchema = z.object({
  transactionId: z.string(),
  amount: z.number(),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export interface Ticket {
  _id: string;
  id?: number;
  userId: string;
  subject: string;
  message: string;
  status: string;
  reply?: string;
  createdAt: Date;
}

export const insertTicketSchema = z.object({
  subject: z.string(),
  message: z.string(),
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;

export interface RedeemCode {
  _id: string;
  id?: number;
  code: string;
  value: number;
  isUsed: boolean;
  usedBy?: string;
  createdAt: Date;
}
