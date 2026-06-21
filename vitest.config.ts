import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Saf yardımcı fonksiyonlar için birim testleri (tests/). Next build'den bağımsız;
// DB/Next runtime gerektirmeyen mantığı (slot/tarih/telefon/plan/sms/format) korur.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
