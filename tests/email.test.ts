import { describe, it, expect, beforeEach } from "vitest";
import { emailConfigured, sendEmail } from "@/lib/email";
import { esc, emailLayout } from "@/lib/email-templates";

describe("email — sağlayıcı soyutlaması (mock-güvenli)", () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  it("RESEND_API_KEY yoksa emailConfigured() false", () => {
    expect(emailConfigured()).toBe(false);
  });

  it("RESEND_API_KEY varsa emailConfigured() true", () => {
    process.env.RESEND_API_KEY = "re_test_123";
    expect(emailConfigured()).toBe(true);
    delete process.env.RESEND_API_KEY;
  });

  it("sağlayıcı yokken gönderim 'mock' döner (gerçek ağ çağrısı yapmaz)", async () => {
    const r = await sendEmail({ to: "a@b.com", subject: "Selam", html: "<p>Merhaba</p>" });
    expect(r.status).toBe("mock");
  });

  it("geçersiz e-posta 'failed' döner", async () => {
    const r = await sendEmail({ to: "gecersiz", subject: "x", html: "<p>x</p>" });
    expect(r.status).toBe("failed");
  });

  it("boş içerik 'failed' döner", async () => {
    const r = await sendEmail({ to: "a@b.com", subject: "", html: "" });
    expect(r.status).toBe("failed");
  });
});

describe("email-templates — HTML kaçış ve şablon", () => {
  it("esc() tehlikeli karakterleri kaçışlar", () => {
    expect(esc('<script>"x"&\'')).toBe("&lt;script&gt;&quot;x&quot;&amp;&#39;");
  });

  it("emailLayout başlık + gövde + CTA içerir", () => {
    const html = emailLayout({
      heading: "Başlık",
      bodyHtml: "Gövde",
      cta: { label: "Tıkla", url: "https://salonor.com/x" },
    });
    expect(html).toContain("Başlık");
    expect(html).toContain("Gövde");
    expect(html).toContain("https://salonor.com/x");
    expect(html).toContain("Tıkla");
  });
});
