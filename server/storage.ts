import { randomBytes } from "crypto";
import { 
  User as UserType, 
  Item as ItemType, 
  Transaction as TransactionType, 
  Ticket as TicketType, 
  InsertUser, 
  InsertItem, 
  InsertTransaction, 
  InsertTicket 
} from "@shared/schema";

export interface IStorage {
  getUser(id: string | number): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  updateUserCredits(id: string, credits: number): Promise<UserType>;
  getUserCount(): Promise<number>;
  
  getItems(): Promise<ItemType[]>;
  getItem(id: string | number): Promise<ItemType | undefined>;
  createItem(item: InsertItem & { contents?: string[] }): Promise<ItemType>;
  deleteItem(id: string | number): Promise<void>;
  
  getTransactions(): Promise<TransactionType[]>;
  createTransaction(transaction: InsertTransaction & { userId: string }): Promise<TransactionType>;
  updateTransactionStatus(id: string | number, status: string): Promise<TransactionType>;
  updateTransactionAmount(id: string | number, amount: number): Promise<TransactionType>;
  
  getTickets(): Promise<TicketType[]>;
  createTicket(ticket: InsertTicket & { userId: string }): Promise<TicketType>;
  updateTicketReply(id: string | number, reply: string): Promise<TicketType>;
  
  createPurchase(userId: string, itemId: string, content: string): Promise<void>;
  hasPurchased(userId: string, itemId: string): Promise<boolean>;
  
  getRedeemCode(code: string): Promise<{ id: string; value: number; isUsed: boolean | null } | undefined>;
  markRedeemCodeUsed(id: string, userId: string): Promise<void>;
  generateRedeemCodes(value: number, count: number): Promise<{ id: string; code: string; value: number }[]>;
}

// In-Memory Storage Implementation
export class InMemoryStorage implements IStorage {
  private users: Map<string, UserType> = new Map();
  private items: Map<string, ItemType> = new Map();
  private transactions: Map<string, TransactionType> = new Map();
  private tickets: Map<string, TicketType> = new Map();
  private purchases: Array<{userId: string; itemId: string}> = [];
  private redeemCodes: Map<string, any> = new Map();
  private nextId = 1;

  private generateId(): string {
    return String(this.nextId++);
  }

  async getUser(id: string | number): Promise<UserType | undefined> {
    return this.users.get(String(id));
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    const users = Array.from(this.users.values());
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) return users[i];
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const id = this.generateId();
    const user: UserType = {
      _id: id,
      id,
      username: insertUser.username,
      password: insertUser.password,
      credits: 0,
      role: insertUser.role || "user",
      createdAt: new Date(),
    } as any;
    this.users.set(id, user);
    return user;
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }

  async updateUserCredits(id: string, credits: number): Promise<UserType> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    user.credits = credits;
    this.users.set(id, user);
    return user;
  }

  async getItems(): Promise<ItemType[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: string | number): Promise<ItemType | undefined> {
    return this.items.get(String(id));
  }

  async createItem(insertItem: InsertItem & { contents?: string[] }): Promise<ItemType> {
    const id = this.generateId();
    const item: ItemType = {
      _id: id,
      id,
      ...insertItem,
      createdAt: new Date(),
    } as any;
    this.items.set(id, item);
    return item;
  }

  async deleteItem(id: string | number): Promise<void> {
    this.items.delete(String(id));
  }

  async getTransactions(): Promise<TransactionType[]> {
    return Array.from(this.transactions.values());
  }

  async createTransaction(transaction: InsertTransaction & { userId: string }): Promise<TransactionType> {
    const id = this.generateId();
    const tx: TransactionType = {
      _id: id,
      id,
      ...transaction,
      status: "pending",
      createdAt: new Date(),
    } as any;
    this.transactions.set(id, tx);
    return tx;
  }

  async updateTransactionStatus(id: string | number, status: string): Promise<TransactionType> {
    const tx = this.transactions.get(String(id));
    if (!tx) throw new Error("Transaction not found");
    tx.status = status;
    this.transactions.set(String(id), tx);
    return tx;
  }

  async updateTransactionAmount(id: string | number, amount: number): Promise<TransactionType> {
    const tx = this.transactions.get(String(id));
    if (!tx) throw new Error("Transaction not found");
    tx.amount = amount;
    this.transactions.set(String(id), tx);
    return tx;
  }

  async getTickets(): Promise<TicketType[]> {
    return Array.from(this.tickets.values());
  }

  async createTicket(ticket: InsertTicket & { userId: string }): Promise<TicketType> {
    const id = this.generateId();
    const t: TicketType = {
      _id: id,
      id,
      ...ticket,
      status: "open",
      createdAt: new Date(),
    } as any;
    this.tickets.set(id, t);
    return t;
  }

  async updateTicketReply(id: string | number, reply: string): Promise<TicketType> {
    const t = this.tickets.get(String(id));
    if (!t) throw new Error("Ticket not found");
    t.reply = reply;
    t.status = "closed";
    this.tickets.set(String(id), t);
    return t;
  }

  async createPurchase(userId: string, itemId: string, content: string): Promise<void> {
    this.purchases.push({ userId, itemId });
  }

  async hasPurchased(userId: string, itemId: string): Promise<boolean> {
    return this.purchases.some(p => p.userId === userId && p.itemId === itemId);
  }

  async getRedeemCode(code: string) {
    const entries = Array.from(this.redeemCodes.entries());
    for (let i = 0; i < entries.length; i++) {
      const [id, rc] = entries[i];
      if (rc.code === code) {
        return { id, value: rc.value, isUsed: rc.isUsed };
      }
    }
    return undefined;
  }

  async markRedeemCodeUsed(id: string, userId: string): Promise<void> {
    const rc = this.redeemCodes.get(id);
    if (rc) {
      rc.isUsed = true;
      rc.usedBy = userId;
    }
  }

  async generateRedeemCodes(value: number, count: number): Promise<{ id: string; code: string; value: number }[]> {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const id = this.generateId();
      const code = randomBytes(8).toString('hex').toUpperCase();
      this.redeemCodes.set(id, { code, value, isUsed: false });
      codes.push({ id, code, value });
    }
    return codes;
  }
}

export const storage = new InMemoryStorage();
