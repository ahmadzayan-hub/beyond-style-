import type { Language, Platform } from "./types";

/**
 * Test scenarios for the intake form. The messages are copied verbatim from
 * the §30 test-scenario conversations in `supabase/seed.sql`, so an operator
 * can try the analyze → guardrail → approve flow without typing.
 * They are synthetic examples, not real customer messages.
 */
export interface IntakeSample {
  id: string;
  label: string;
  /** What the scenario is meant to exercise. */
  checks: string;
  customerName: string;
  platform: Platform;
  language: Language;
  message: string;
  emirate: string;
}

export const INTAKE_SAMPLES: readonly IntakeSample[] = [
  {
    id: "arabic-custom",
    label: "Arabic name request",
    checks: "Arabic name handling (Rehab → رحاب)",
    customerName: "Rehab Ismail Fawzy",
    platform: "instagram",
    language: "ar",
    message: "السلام عليكم، أبغى تصميم خاص اسم بالعربي على سلسلة",
    emirate: "",
  },
  {
    id: "privacy-al-ain",
    label: "Phone + address in DM",
    checks: "Privacy warning and out-of-Dubai delivery",
    customerName: "Kay",
    platform: "whatsapp",
    language: "en",
    message: "I want 3 bracelets. My address is in Al Ain. Phone 0501234567",
    emirate: "",
  },
  {
    id: "price-only",
    label: "\"How much?\"",
    checks: "Price-first reply needs an active offer",
    customerName: "Norhan",
    platform: "instagram",
    language: "en",
    message: "How much?",
    emirate: "",
  },
  {
    id: "supplier",
    label: "Supplier pitch",
    checks: "Supplier outreach, pay-today pressure",
    customerName: "GoldenAccessories Trading",
    platform: "instagram",
    language: "en",
    message: "Wholesale offer for bracelets, great prices, pay today for best rate",
    emirate: "",
  },
];

/** Fields a sample overwrites. Everything else in the form is reset. */
export function sampleToFormFields(sample: IntakeSample) {
  return {
    customerName: sample.customerName,
    platform: sample.platform,
    language: sample.language,
    message: sample.message,
    emirate: sample.emirate,
  };
}

/**
 * Same rule the intake form uses to warn before a public reply: a UAE mobile
 * number or a street-level address word in the pasted message.
 */
export function hasPrivateData(message: string): boolean {
  return (
    /(?:\+?971|0)\s?5\d/.test(message) ||
    /\b(villa|building|apartment|street|p\.?o\.?\s?box|makani)\b/i.test(message)
  );
}
