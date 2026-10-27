import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { INTAKE_SAMPLES, hasPrivateData, sampleToFormFields } from "../src/lib/intake-samples";

const seed = readFileSync(join(__dirname, "..", "supabase", "seed.sql"), "utf8");

describe("intake test scenarios", () => {
  it("copies every message verbatim from the §30 seed scenarios", () => {
    for (const s of INTAKE_SAMPLES) {
      expect(seed, s.id).toContain(`'${s.message}'`);
      expect(seed, s.id).toContain(`'${s.customerName}'`);
    }
  });

  it("has unique ids", () => {
    const ids = INTAKE_SAMPLES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("maps a sample onto the form fields only", () => {
    const f = sampleToFormFields(INTAKE_SAMPLES[0]);
    expect(Object.keys(f).sort()).toEqual(["customerName", "emirate", "language", "message", "platform"]);
    expect(f.language).toBe("ar");
  });

  it("flags the phone-number scenario as private data, and not the price question", () => {
    const byId = Object.fromEntries(INTAKE_SAMPLES.map((s) => [s.id, s]));
    expect(hasPrivateData(byId["privacy-al-ain"].message)).toBe(true);
    expect(hasPrivateData(byId["price-only"].message)).toBe(false);
    expect(hasPrivateData("Deliver to Villa 12 please")).toBe(true);
  });
});
