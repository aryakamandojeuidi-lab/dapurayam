"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { createOrderSchema, updateOrderStatusSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/order-utils";

/**
 * Public Server Action — used by the public product/order form to submit an order.
 * Does NOT require admin auth.
 *
 * Returns: { success, orderNumber?, error? }
 */
export async function createOrderAction(payload: unknown) {
  try {
    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      };
    }

    const data = parsed.data;
    const orderNumber = generateOrderNumber();

    // Verify all product IDs exist & are active (for website orders)
    if (data.channel === "WEBSITE") {
      const productIds = data.items.map((i) => i.productId);
      const products = await db.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        select: { id: true },
      });
      if (products.length !== productIds.length) {
        return {
          success: false,
          error:
            "Salah satu produk tidak tersedia atau tidak aktif. Silakan periksa kembali keranjang Anda.",
        };
      }
    }

    // Compute totals
    const items = data.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      productSlug: i.productSlug ?? null,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
      subtotal: i.unitPrice * i.quantity,
    }));
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = items.reduce((s, i) => s + i.subtotal, 0);

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail ?? null,
        customerAddress: data.customerAddress ?? null,
        customerNote: data.customerNote ?? null,
        channel: data.channel,
        status: "PENDING",
        totalItems,
        totalAmount,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    revalidatePath("/admin/pesanan");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    };
  } catch (err: unknown) {
    console.error("[createOrderAction] error:", err);
    return {
      success: false,
      error: "Gagal memproses pesanan. Silakan coba lagi atau hubungi admin via WhatsApp.",
    };
  }
}

/**
 * Admin Server Action — update order status + admin note.
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: string,
  adminNote?: string,
) {
  await requireAdmin();
  try {
    const parsed = updateOrderStatusSchema.safeParse({
      status,
      adminNote: adminNote ?? null,
    });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(", "),
      };
    }
    await db.order.update({
      where: { id: orderId },
      data: {
        status: parsed.data.status,
        adminNote: parsed.data.adminNote ?? null,
      },
    });
    revalidatePath("/admin/pesanan");
    revalidatePath(`/admin/pesanan/${orderId}`);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("[updateOrderStatusAction] error:", err);
    return { success: false, error: "Gagal memperbarui status pesanan." };
  }
}

/**
 * Admin Server Action — delete order (admin only, with confirmation).
 */
export async function deleteOrderAction(orderId: string) {
  await requireAdmin();
  try {
    await db.order.delete({
      where: { id: orderId },
    });
    revalidatePath("/admin/pesanan");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteOrderAction] error:", err);
    return { success: false, error: "Gagal menghapus pesanan." };
  }
}
