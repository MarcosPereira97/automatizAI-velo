import { describe, it, expect } from "vitest";
import { generateOrderNumber, dbOrderToOrder, DbOrder } from "./useOrders";

describe("useOrders utilities", () => {
  describe("generateOrderNumber", () => {
    it("should generate an order number with prefix VLO- and 6 alphanumeric characters", () => {
      const orderNum = generateOrderNumber();
      expect(orderNum).toMatch(/^VLO-[A-Z0-9]{6}$/);
    });

    it("should generate unique order numbers", () => {
      const num1 = generateOrderNumber();
      const num2 = generateOrderNumber();
      expect(num1).not.toBe(num2);
    });
  });

  describe("dbOrderToOrder", () => {
    it("should correctly map a complete database order to the application model", () => {
      const mockDbOrder: DbOrder = {
        id: "uuid-1234",
        order_number: "VLO-123456",
        color: "midnight-black",
        wheel_type: "sport",
        optionals: ["flux-capacitor"],
        customer_name: "John Doe Smith",
        customer_email: "john@example.com",
        customer_phone: "11999999999",
        customer_cpf: "12345678900",
        payment_method: "financiamento",
        total_price: 55000,
        status: "EM_ANALISE",
        created_at: "2026-07-23T10:00:00Z",
        updated_at: "2026-07-23T10:00:00Z",
      };

      const result = dbOrderToOrder(mockDbOrder);

      expect(result.id).toBe("VLO-123456");
      expect(result.configuration.exteriorColor).toBe("midnight-black");
      expect(result.configuration.interiorColor).toBe("cream");
      expect(result.configuration.wheelType).toBe("sport");
      expect(result.configuration.optionals).toEqual(["flux-capacitor"]);
      expect(result.totalPrice).toBe(55000);
      expect(result.customer.name).toBe("John");
      expect(result.customer.surname).toBe("Doe Smith");
      expect(result.customer.email).toBe("john@example.com");
      expect(result.customer.phone).toBe("11999999999");
      expect(result.customer.cpf).toBe("12345678900");
      expect(result.customer.store).toBe(""); // Hardcoded to '' inside dbOrderToOrder
      expect(result.paymentMethod).toBe("financiamento");
      expect(result.status).toBe("EM_ANALISE");
      expect(result.createdAt).toBe("2026-07-23T10:00:00Z");
    });

    it("should handle null optionals and single names", () => {
      const mockDbOrder = {
        id: "uuid-5678",
        order_number: "VLO-654321",
        color: "glacier-blue",
        wheel_type: "aero",
        optionals: null,
        customer_name: "Jane",
        customer_email: "jane@example.com",
        customer_phone: "11999999998",
        customer_cpf: "09876543211",
        payment_method: "avista",
        total_price: 40000,
        status: "APROVADO",
        created_at: "2026-07-23T11:00:00Z",
        updated_at: "2026-07-23T11:00:00Z",
      } as DbOrder;

      const result = dbOrderToOrder(mockDbOrder);

      expect(result.configuration.optionals).toEqual([]);
      expect(result.customer.name).toBe("Jane");
      expect(result.customer.surname).toBe(""); // No surname provided
    });
  });
});
