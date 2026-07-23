import { describe, it, expect, beforeEach } from "vitest"
import {
  calculateTotalPrice,
  calculateInstallment,
  formatPrice,
  CarConfiguration,
  useConfiguratorStore,
} from "./configuratorStore"

describe("configuratorStore functions", () => {
  describe("calculateTotalPrice", () => {
    it("should calculate base price", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "aero",
        optionals: [],
      }
      expect(calculateTotalPrice(config)).toBe(40000)
    })

    it("should add sport wheels price", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "sport",
        optionals: [],
      }
      expect(calculateTotalPrice(config)).toBe(42000)
    })

    it("should add optional features prices", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "aero",
        optionals: ["precision-park", "flux-capacitor"],
      }
      expect(calculateTotalPrice(config)).toBe(50500)
    })

    it("should calculate price with sport wheels and all optionals", () => {
      const config: CarConfiguration = {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "sport",
        optionals: ["precision-park", "flux-capacitor"],
      }
      expect(calculateTotalPrice(config)).toBe(52500)
    })
  })

  describe("calculateInstallment", () => {
    it("should calculate correct installment for base price (40000)", () => {
      const expected =
        Math.round(
          ((40000 * 0.02 * Math.pow(1.02, 12)) / (Math.pow(1.02, 12) - 1)) *
            100,
        ) / 100
      expect(calculateInstallment(40000)).toBe(expected)
    })
  })

  describe("formatPrice", () => {
    it("should format number to BRL currency string", () => {
      const formatted = formatPrice(40000)
      // Depending on the environment, the formatting might vary slightly (e.g., non-breaking spaces).
      // We check for the presence of the currency symbol and the formatted number.
      expect(formatted).toContain("R$")
      expect(formatted).toContain("40.000,00")
    })
  })
})

describe("useConfiguratorStore state rules", () => {
  beforeEach(() => {
    useConfiguratorStore.getState().resetConfiguration()
    useConfiguratorStore.setState({
      orders: [],
      currentUserEmail: null,
      viewMode: "exterior",
    })
  })

  it("should change viewMode to exterior when setting exterior color", () => {
    useConfiguratorStore.getState().setViewMode("interior")
    useConfiguratorStore.getState().setExteriorColor("midnight-black")
    expect(useConfiguratorStore.getState().viewMode).toBe("exterior")
    expect(useConfiguratorStore.getState().configuration.exteriorColor).toBe(
      "midnight-black",
    )
  })

  it("should change viewMode to interior when setting interior color", () => {
    useConfiguratorStore.getState().setInteriorColor("deep-blue")
    expect(useConfiguratorStore.getState().viewMode).toBe("interior")
    expect(useConfiguratorStore.getState().configuration.interiorColor).toBe(
      "deep-blue",
    )
  })

  it("should toggle optionals correctly without duplicates", () => {
    useConfiguratorStore.getState().toggleOptional("precision-park")
    expect(useConfiguratorStore.getState().configuration.optionals).toContain(
      "precision-park",
    )

    useConfiguratorStore.getState().toggleOptional("precision-park")
    expect(
      useConfiguratorStore.getState().configuration.optionals,
    ).not.toContain("precision-park")
  })

  it("should only allow login if user has orders", () => {
    const successWithoutOrders = useConfiguratorStore
      .getState()
      .login("test@test.com")
    expect(successWithoutOrders).toBe(false)
    expect(useConfiguratorStore.getState().currentUserEmail).toBeNull()

    // Add a fake order
    useConfiguratorStore.getState().addOrder({
      id: "VLO-123",
      customer: {
        email: "test@test.com",
        name: "Test",
        surname: "User",
        phone: "",
        cpf: "",
        store: "",
      },
      configuration: {
        exteriorColor: "glacier-blue",
        interiorColor: "carbon-black",
        wheelType: "aero",
        optionals: [],
      },
      totalPrice: 40000,
      paymentMethod: "avista",
      status: "APROVADO",
      createdAt: new Date().toISOString(),
    })

    const successWithOrders = useConfiguratorStore
      .getState()
      .login("test@test.com")
    expect(successWithOrders).toBe(true)
    expect(useConfiguratorStore.getState().currentUserEmail).toBe(
      "test@test.com",
    )
  })
})
