import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitContactForm, subscribeNewsletter } from "../public";
import { messageService } from "@/lib/services/messageService";
import { subscriberService } from "@/lib/services/subscriberService";
import { isRateLimited } from "@/lib/rateLimit";

// ─── Service mocks ────────────────────────────────────────────────────────────
vi.mock("@/lib/services/messageService", () => ({
  messageService: { createMessage: vi.fn() },
}));

vi.mock("@/lib/services/subscriberService", () => ({
  subscriberService: { addSubscriber: vi.fn() },
}));

// ─── Rate limiter: allow by default, mockable in tests ────────────────────────
vi.mock("@/lib/rateLimit", () => ({
  isRateLimited: vi.fn(),
  getClientIp: vi.fn().mockResolvedValue("127.0.0.1"),
}));

// ─── next/headers mock ────────────────────────────────────────────────────────
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue("127.0.0.1"),
  }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeContactForm(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.append("name", overrides.name ?? "Alice");
  fd.append("email", overrides.email ?? "alice@example.com");
  fd.append("subject", overrides.subject ?? "Hello");
  fd.append("message", overrides.message ?? "Just saying hi");
  return fd;
}

function makeNewsletterForm(email = "alice@example.com"): FormData {
  const fd = new FormData();
  fd.append("email", email);
  return fd;
}

// ─────────────────────────────────────────────────────────────────────────────
describe("submitContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isRateLimited).mockReturnValue(false);
  });

  it("saves message and returns success with valid data", async () => {
    vi.mocked(messageService.createMessage).mockResolvedValueOnce({} as any);

    const result = await submitContactForm(null, makeContactForm());

    expect(messageService.createMessage).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "Just saying hi",
    });
    expect(result).toEqual({ success: true });
  });

  it("returns error when name is missing", async () => {
    const result = await submitContactForm(null, makeContactForm({ name: "" }));
    expect(result).toHaveProperty("error");
    expect(messageService.createMessage).not.toHaveBeenCalled();
  });

  it("returns error when email is invalid", async () => {
    const result = await submitContactForm(
      null,
      makeContactForm({ email: "not-an-email" })
    );
    expect(result).toHaveProperty("error");
    expect(messageService.createMessage).not.toHaveBeenCalled();
  });

  it("returns error when message body is empty", async () => {
    const result = await submitContactForm(
      null,
      makeContactForm({ message: "" })
    );
    expect(result).toHaveProperty("error");
    expect(messageService.createMessage).not.toHaveBeenCalled();
  });

  it("returns error when service throws", async () => {
    vi.mocked(messageService.createMessage).mockRejectedValueOnce(
      new Error("DB error")
    );
    const result = await submitContactForm(null, makeContactForm());
    expect(result).toEqual({ error: "DB error" });
  });

  it("blocks request when rate limited", async () => {
    vi.mocked(isRateLimited).mockReturnValueOnce(true);

    const result = await submitContactForm(null, makeContactForm());
    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/too many requests/i);
    expect(messageService.createMessage).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("subscribeNewsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isRateLimited).mockReturnValue(false);
  });

  it("creates subscriber and returns success with valid email", async () => {
    vi.mocked(subscriberService.addSubscriber).mockResolvedValueOnce({} as any);

    const result = await subscribeNewsletter(null, makeNewsletterForm());

    expect(subscriberService.addSubscriber).toHaveBeenCalledWith(
      "alice@example.com"
    );
    expect(result).toEqual({ success: true });
  });

  it("returns error with invalid email", async () => {
    const result = await subscribeNewsletter(
      null,
      makeNewsletterForm("not-valid")
    );
    expect(result).toHaveProperty("error");
    expect(subscriberService.addSubscriber).not.toHaveBeenCalled();
  });

  it("returns friendly message when already subscribed (P2002)", async () => {
    const prismaUniqueError = Object.assign(new Error("Unique"), {
      code: "P2002",
    });
    vi.mocked(subscriberService.addSubscriber).mockRejectedValueOnce(
      prismaUniqueError
    );

    const result = await subscribeNewsletter(null, makeNewsletterForm());
    expect(result.error).toMatch(/already subscribed/i);
  });

  it("returns error when service throws unexpectedly", async () => {
    vi.mocked(subscriberService.addSubscriber).mockRejectedValueOnce(
      new Error("Connection lost")
    );
    const result = await subscribeNewsletter(null, makeNewsletterForm());
    expect(result).toEqual({ error: "Connection lost" });
  });

  it("blocks request when rate limited", async () => {
    vi.mocked(isRateLimited).mockReturnValueOnce(true);

    const result = await subscribeNewsletter(null, makeNewsletterForm());
    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/too many requests/i);
    expect(subscriberService.addSubscriber).not.toHaveBeenCalled();
  });
});
