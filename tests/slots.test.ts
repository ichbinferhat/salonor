import { describe, it, expect, vi, beforeEach } from "vitest";

// --- DB mock'u (Prisma'ya hiç dokunmadan) ---
const mockWorkingHourFindUnique = vi.fn();
const mockStaffFindMany = vi.fn();
const mockAppointmentFindMany = vi.fn();
const mockAppointmentCount = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    workingHour: { findUnique: (...a: unknown[]) => mockWorkingHourFindUnique(...a) },
    staff: { findMany: (...a: unknown[]) => mockStaffFindMany(...a) },
    appointment: {
      findMany: (...a: unknown[]) => mockAppointmentFindMany(...a),
      count: (...a: unknown[]) => mockAppointmentCount(...a),
    },
  },
}));

// datetime: weekdayOf gerçek kalsın (saf tarih matematiği), today/now kontrol edilsin.
const mockTodayStr = vi.fn<() => string>();
const mockNowMinutes = vi.fn<() => number>();
vi.mock("@/lib/datetime", async () => {
  const actual = await vi.importActual<typeof import("@/lib/datetime")>("@/lib/datetime");
  return {
    ...actual,
    todayStr: () => mockTodayStr(),
    nowMinutes: () => mockNowMinutes(),
  };
});

import { getAvailableSlots, hasConflict, generateCode } from "@/lib/slots";

// Yardımcı: tek bir personel kümesi
function staff(ids: string[], serviceMap: Record<string, string[]> = {}) {
  return ids.map((id) => ({
    id,
    services: (serviceMap[id] ?? []).map((serviceId) => ({ serviceId })),
  }));
}

describe("slots — getAvailableSlots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // varsayılan: bu tarih "bugün değil" -> geçmiş filtresi devre dışı
    mockTodayStr.mockReturnValue("2099-01-01");
    mockNowMinutes.mockReturnValue(0);
    mockAppointmentFindMany.mockResolvedValue([]);
  });

  it("kapalı gün için boş liste döner", async () => {
    mockWorkingHourFindUnique.mockResolvedValue({ closed: true, openMin: 540, closeMin: 1080 });
    const slots = await getAvailableSlots({
      businessId: "b1",
      date: "2026-06-20",
      durationMin: 30,
    });
    expect(slots).toEqual([]);
    expect(mockStaffFindMany).not.toHaveBeenCalled();
  });

  it("çalışma saati kaydı yoksa boş liste döner", async () => {
    mockWorkingHourFindUnique.mockResolvedValue(null);
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    expect(slots).toEqual([]);
  });

  it("uygun personel yoksa boş liste döner", async () => {
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 });
    mockStaffFindMany.mockResolvedValue([]);
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    expect(slots).toEqual([]);
  });

  it("boş takvimde 15 dk adımlarla çalışma saatini doldurur", async () => {
    // 09:00-10:00 (540-600), süre 30dk -> başlangıçlar: 540, 555, 570 (570+30=600 OK), 585+30=615 > 600 hayır
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    expect(slots.map((s) => s.time)).toEqual([540, 555, 570]);
    expect(slots.every((s) => s.staffIds.includes("s1"))).toBe(true);
  });

  it("kapanışa taşan süre son slotları reddeder (sınır)", async () => {
    // 09:00-09:45 (540-585), süre 30 -> 540 (570 OK), 555 (585 OK), 570 (600>585 red)
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 585 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    expect(slots.map((s) => s.time)).toEqual([540, 555]);
  });

  it("çalışma penceresinden uzun hizmet hiç slot üretmez", async () => {
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 }); // 60 dk
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 90 });
    expect(slots).toEqual([]);
  });

  it("dolu randevu o aralıktaki slotları kapatır (çakışma matematiği)", async () => {
    // 09:00-11:00 (540-660), süre 30. Randevu 600-630 (10:00-10:30) dolu.
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 660 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    mockAppointmentFindMany.mockResolvedValue([{ staffId: "s1", startMin: 600, endMin: 630 }]);
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    const times = slots.map((s) => s.time);
    // t<630 && t+30>600  -> çakışan başlangıçlar: 585(615>600), 600, 615 kapalı.
    // 570+30=600, 600'e değer ama >600 değil -> uygun. 630 randevu biter, başlayabilir.
    expect(times).toContain(570); // 570-600 randevudan hemen önce, bitişik OK
    expect(times).not.toContain(585);
    expect(times).not.toContain(600);
    expect(times).not.toContain(615);
    expect(times).toContain(630); // randevu bitince hemen başlar (tam bitişik)
  });

  it("tam-bitişik randevular: bir randevu bitince diğeri başlayabilir", async () => {
    // süre 30. Randevu 540-570. 570'te başlamak serbest olmalı (t < b.e: 570<570 false).
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 660 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    mockAppointmentFindMany.mockResolvedValue([{ staffId: "s1", startMin: 540, endMin: 570 }]);
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    const times = slots.map((s) => s.time);
    expect(times).not.toContain(540);
    expect(times).toContain(570); // bitişik başlangıç serbest
  });

  it("çakışan personel kapanır, diğeri açık kalır (staffIds doğru)", async () => {
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 });
    mockStaffFindMany.mockResolvedValue(staff(["s1", "s2"]));
    mockAppointmentFindMany.mockResolvedValue([{ staffId: "s1", startMin: 540, endMin: 570 }]);
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-20", durationMin: 30 });
    const at540 = slots.find((s) => s.time === 540);
    expect(at540?.staffIds).toEqual(["s2"]); // s1 dolu, sadece s2
    const at570 = slots.find((s) => s.time === 570);
    expect(at570?.staffIds.sort()).toEqual(["s1", "s2"]); // ikisi de boş
  });

  it("serviceIds: tüm hizmetleri yapamayan personel elenir", async () => {
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 });
    mockStaffFindMany.mockResolvedValue(
      staff(["s1", "s2"], { s1: ["svc-a", "svc-b"], s2: ["svc-a"] })
    );
    const slots = await getAvailableSlots({
      businessId: "b1",
      date: "2026-06-20",
      durationMin: 30,
      serviceIds: ["svc-a", "svc-b"],
    });
    expect(slots.length).toBeGreaterThan(0);
    // s2 svc-b yapamaz -> hiçbir slotta görünmemeli
    expect(slots.every((s) => s.staffIds.length === 1 && s.staffIds[0] === "s1")).toBe(true);
  });

  it("tüm hizmetleri yapabilen personel yoksa boş liste", async () => {
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"], { s1: ["svc-a"] }));
    const slots = await getAvailableSlots({
      businessId: "b1",
      date: "2026-06-20",
      durationMin: 30,
      serviceIds: ["svc-a", "svc-b"],
    });
    expect(slots).toEqual([]);
  });

  it("bugün için LEAD_TIME (30dk) önünden geçmiş saatler filtrelenir", async () => {
    const date = "2026-06-20";
    mockTodayStr.mockReturnValue(date); // bu tarih bugün
    mockNowMinutes.mockReturnValue(560); // şu an 09:20 -> minStart = 590
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 660 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    const slots = await getAvailableSlots({ businessId: "b1", date, durationMin: 30 });
    const times = slots.map((s) => s.time);
    // minStart=590 -> 540,555,570,585 elenmeli; 600,615,... kalmalı
    expect(times.every((t) => t >= 590)).toBe(true);
    expect(times).not.toContain(585);
    expect(times).toContain(600);
  });

  it("gelecekteki tarihte geçmiş filtresi uygulanmaz (now görmezden gelinir)", async () => {
    mockTodayStr.mockReturnValue("2026-06-20");
    mockNowMinutes.mockReturnValue(1000); // bugün için çok geç ama tarih farklı
    mockWorkingHourFindUnique.mockResolvedValue({ closed: false, openMin: 540, closeMin: 600 });
    mockStaffFindMany.mockResolvedValue(staff(["s1"]));
    const slots = await getAvailableSlots({ businessId: "b1", date: "2026-06-21", durationMin: 30 });
    expect(slots.map((s) => s.time)).toEqual([540, 555, 570]); // tam liste, filtre yok
  });
});

describe("slots — hasConflict", () => {
  beforeEach(() => vi.clearAllMocks());

  it("çakışan randevu varsa true", async () => {
    mockAppointmentCount.mockResolvedValue(1);
    const res = await hasConflict({ staffId: "s1", date: "2026-06-20", startMin: 540, endMin: 600 });
    expect(res).toBe(true);
  });

  it("çakışma yoksa false", async () => {
    mockAppointmentCount.mockResolvedValue(0);
    const res = await hasConflict({ staffId: "s1", date: "2026-06-20", startMin: 540, endMin: 600 });
    expect(res).toBe(false);
  });

  it("yarı-açık aralık sorgusu kullanır (startMin<lt end, endMin>gt start)", async () => {
    mockAppointmentCount.mockResolvedValue(0);
    await hasConflict({ staffId: "s1", date: "2026-06-20", startMin: 540, endMin: 600 });
    const arg = mockAppointmentCount.mock.calls[0][0] as {
      where: { startMin: { lt: number }; endMin: { gt: number }; status: { in: string[] } };
    };
    expect(arg.where.startMin.lt).toBe(600); // endMin
    expect(arg.where.endMin.gt).toBe(540); // startMin
    expect(arg.where.status.in).toEqual(["CONFIRMED", "COMPLETED"]);
  });
});

describe("slots — generateCode", () => {
  it("SLNR- öneki ve 6 karakterli kod üretir", () => {
    const code = generateCode();
    expect(code).toMatch(/^SLNR-[ABCDEFGHJKLMNPRSTUVYZ23456789]{6}$/);
  });

  it("karışıklık yaratan karakter içermez (I, O, Q, 0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      const body = generateCode().slice(5);
      expect(body).not.toMatch(/[IOQ01]/);
    }
  });

  it("makul ölçüde benzersiz kodlar üretir", () => {
    const set = new Set(Array.from({ length: 100 }, () => generateCode()));
    expect(set.size).toBeGreaterThan(95);
  });
});
