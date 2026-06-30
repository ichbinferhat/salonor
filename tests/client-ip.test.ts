import { describe, it, expect } from "vitest";
import { clientIpFromHeaders } from "@/lib/client-ip";

function h(headers: Record<string, string>) {
  return new Headers(headers);
}

// TRUSTED_PROXY_HOPS ayarlanmadığında varsayılan 1 (en sağdaki/son hop) geçerlidir.
describe("clientIpFromHeaders — güvenilir (sağdan son hop) istemci IP'si", () => {
  it("tek girdili XFF → o IP", () => {
    expect(clientIpFromHeaders(h({ "x-forwarded-for": "1.2.3.4" }))).toBe("1.2.3.4");
  });

  it("istemci sahte XFF gönderse de güvenilen proxy'nin eklediği EN SAĞDAKİ hop alınır", () => {
    // Saldırgan sol uca sahte IP koyar; Render/LB gerçek peer IP'sini SAĞA ekler.
    expect(clientIpFromHeaders(h({ "x-forwarded-for": "9.9.9.9, 5.6.7.8" }))).toBe("5.6.7.8");
  });

  it("çok hop'lu zincirde de en sağdaki (güvenilen son proxy'nin gördüğü) alınır", () => {
    expect(clientIpFromHeaders(h({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 3.3.3.3" }))).toBe("3.3.3.3");
  });

  it("x-real-ip artık güvenilmez (sahtelenebilir) → XFF yoksa unknown", () => {
    expect(clientIpFromHeaders(h({ "x-real-ip": "6.6.6.6" }))).toBe("unknown");
  });

  it("hiç ilgili başlık yoksa unknown", () => {
    expect(clientIpFromHeaders(h({}))).toBe("unknown");
  });

  it("XFF girdilerindeki boşluklar temizlenir", () => {
    expect(clientIpFromHeaders(h({ "x-forwarded-for": " 1.1.1.1 , 2.2.2.2 " }))).toBe("2.2.2.2");
  });

  it("boş XFF → unknown", () => {
    expect(clientIpFromHeaders(h({ "x-forwarded-for": "" }))).toBe("unknown");
  });
});
