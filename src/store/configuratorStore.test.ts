import { describe, it, expect } from "vitest";
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration,
} from "./configuratorStore";

describe("configuratorStore functions", () => {
  describe("calculateTotalPrice", () => {
    it("should calculate base price", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "aero",
        optionals: [],
      };
      expect(calculateTotalPrice(config)).toBe(40000);
    });

    it("should add sport wheels price", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "sport",
        optionals: [],
      };
      expect(calculateTotalPrice(config)).toBe(42000);
    });

    it("should add optional features prices", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "aero",
        optionals: ["precision-park", "flux-capacitor"],
      };
      expect(calculateTotalPrice(config)).toBe(50500);
    });

    it("should calculate price with sport wheels and all optionals", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "sport",
        optionals: ["precision-park", "flux-capacitor"],
      };
      expect(calculateTotalPrice(config)).toBe(52500);
    });
  });

  describe("calculateInstallment", () => {
    it("should calculate correct installment for base price (40000)", () => {
      const expected =
        Math.round(
          ((40000 * 0.02 * Math.pow(1.02, 12)) / (Math.pow(1.02, 12) - 1)) *
            100,
        ) / 100;
      expect(calculateInstallment(40000)).toBe(expected);
    });
  });

  describe("formatPrice", () => {
    it("should format number to BRL currency string", () => {
      const formatted = formatPrice(40000);
      // Depending on the environment, the formatting might vary slightly (e.g., non-breaking spaces).
      // We check for the presence of the currency symbol and the formatted number.
      expect(formatted).toContain("R$");
      expect(formatted).toContain("40.000,00");
    });
  });
});
