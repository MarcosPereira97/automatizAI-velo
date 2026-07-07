import { db } from "./database"
import { OrderTable } from "./schema"

import { OrderDetails } from "../actions/orderLookupActions"

import crypto from "crypto"

export function normalizeValue(value: string) {
  if (!value) return ""

  return value
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "") // remove espaços
    .toLowerCase() // lowercase
}

export async function insertOrder(order: OrderDetails) {
  const data: OrderTable = {
    id: crypto.randomUUID(),
    order_number: order.number,
    color: order.color.toLowerCase().replace(" ", "-"),
    wheel_type: order.wheels.replace(" Wheels", "").toLowerCase(),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: normalizeValue(order.payment),
    total_price: order.total_price,
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
  }

  await db
    .insertInto("orders")
    .values(data)
    .onConflict((oc) =>
      oc.column("order_number").doUpdateSet({
        status: data.status,
        color: data.color,
        wheel_type: data.wheel_type,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_cpf: data.customer_cpf,
        payment_method: data.payment_method,
        total_price: data.total_price,
        updated_at: data.updated_at,
        optionals: data.optionals,
      }),
    )
    .execute()
}

export async function deleteOrderByNumber(orderNumber: string) {
  await db
    .deleteFrom("orders")
    .where("order_number", "=", orderNumber)
    .execute()
}

export async function deleteOrderByEmail(email: string) {
  await db.deleteFrom("orders").where("customer_email", "=", email).execute()
}
