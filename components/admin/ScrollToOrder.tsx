"use client";

import { useEffect } from "react";

/** Scrolls the highlighted order (opened from a new-order alert) into view. */
export default function ScrollToOrder({ orderId }: { orderId: string }) {
  useEffect(() => {
    document
      .getElementById(`order-${orderId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [orderId]);

  return null;
}
