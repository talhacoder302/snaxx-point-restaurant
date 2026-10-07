"use client";

import { useId, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { placeOrder, type PlaceOrderResult, type PlacedOrder } from "@/app/orders/actions";
import type { CartItem } from "@/lib/cart";
import type { OrderType } from "@/lib/order-status";
import { formatPrice } from "@/lib/price";
import LocationIcon from "../icons/LocationIcon";

type CheckoutFormProps = {
  items: CartItem[];
  totalQuantity: number;
  total: number | null;
  onPlaced: (order: PlacedOrder) => void;
};

type SavedCustomer = {
  customerName: string;
  phone: string;
  orderType: OrderType;
  deliveryAddress: string;
  landmark: string;
};

type FieldErrors = Extract<PlaceOrderResult, { ok: false }>["fieldErrors"];

const CUSTOMER_STORAGE_KEY = "snaxx-customer";

/** Details from this browser's last order, so returning customers don't retype them. */
function readSavedCustomer(): Partial<SavedCustomer> {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return typeof parsed === "object" && parsed !== null ? (parsed as Partial<SavedCustomer>) : {};
  } catch {
    return {};
  }
}

function saveCustomer(customer: SavedCustomer) {
  try {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  } catch {
    // Storage unavailable — the customer just retypes next time.
  }
}

const inputClasses =
  "w-full rounded-[12px] border bg-white px-3.5 py-3 text-[14.5px] text-ink outline-none transition-colors placeholder:text-mist/70 focus:border-ember/50 focus:ring-4 focus:ring-ember/[0.08]";

function Field({
  label,
  hint,
  error,
  htmlFor,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-bold text-ink">{label}</span>
        {hint && <span className="text-[11.5px] font-medium text-mist">{hint}</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={errorId} className="mt-1.5 text-[12.5px] font-semibold text-ember">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({ items, totalQuantity, total, onPlaced }: CheckoutFormProps) {
  const id = useId();
  // The checkout step only ever renders after a click, never on the server,
  // so reading localStorage while initialising state can't cause a hydration mismatch.
  const [saved] = useState(readSavedCustomer);
  const [orderType, setOrderType] = useState<OrderType>(
    saved.orderType === "pickup" ? "pickup" : "delivery"
  );
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const get = (name: string) => String(formData.get(name) ?? "");

    const customer: SavedCustomer = {
      customerName: get("customerName"),
      phone: get("phone"),
      orderType,
      deliveryAddress: get("deliveryAddress"),
      landmark: get("landmark"),
    };

    startTransition(async () => {
      try {
        const result = await placeOrder({
          ...customer,
          notes: get("notes"),
          items: items.map(({ key, name, quantity }) => ({ key, name, quantity })),
        });

        if (!result.ok) {
          setError(result.error);
          setFieldErrors(result.fieldErrors ?? {});
          return;
        }

        saveCustomer(customer);
        onPlaced(result.order);
      } catch {
        setError("Something went wrong. Please check your connection and try again.");
        setFieldErrors({});
      }
    });
  };

  const errorProps = (name: keyof NonNullable<FieldErrors>) => ({
    "aria-invalid": fieldErrors?.[name] ? true : undefined,
    "aria-describedby": fieldErrors?.[name] ? `${id}-${name}-error` : undefined,
    className: `${inputClasses} ${fieldErrors?.[name] ? "border-ember/60" : "border-ink/[0.12]"}`,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
        {/* Order type */}
        <fieldset>
          <legend className="text-[13px] font-bold text-ink">How would you like your order?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-[14px] bg-cream-deep p-1">
            {(
              [
                { value: "delivery", label: "Delivery", emoji: "🛵" },
                { value: "pickup", label: "Pickup", emoji: "🛍️" },
              ] as const
            ).map((option) => {
              const selected = orderType === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-[11px] py-2.5 text-[13.5px] font-bold transition-all duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember/70 ${
                    selected
                      ? "bg-white text-ember shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                      : "text-smoke hover:text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="orderType"
                    value={option.value}
                    checked={selected}
                    onChange={() => setOrderType(option.value)}
                    className="sr-only"
                  />
                  <span aria-hidden="true">{option.emoji}</span>
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field
          label="Full name"
          htmlFor={`${id}-customerName`}
          errorId={`${id}-customerName-error`}
          error={fieldErrors?.customerName}
        >
          <input
            id={`${id}-customerName`}
            name="customerName"
            autoComplete="name"
            defaultValue={saved.customerName}
            placeholder="e.g. Ali Khan"
            maxLength={80}
            required
            {...errorProps("customerName")}
          />
        </Field>

        <Field
          label="Mobile number"
          hint="WhatsApp preferred"
          htmlFor={`${id}-phone`}
          errorId={`${id}-phone-error`}
          error={fieldErrors?.phone}
        >
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={saved.phone}
            placeholder="0300 1234567"
            maxLength={20}
            required
            {...errorProps("phone")}
          />
        </Field>

        {orderType === "delivery" && (
          <>
            <Field
              label="Delivery address"
              hint="House, street, area"
              htmlFor={`${id}-deliveryAddress`}
              errorId={`${id}-deliveryAddress-error`}
              error={fieldErrors?.deliveryAddress}
            >
              <div className="relative">
                <LocationIcon className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-ember/70" />
                <textarea
                  id={`${id}-deliveryAddress`}
                  name="deliveryAddress"
                  autoComplete="street-address"
                  defaultValue={saved.deliveryAddress}
                  placeholder="House 12, Street 4, Block B, Model Town"
                  rows={2}
                  maxLength={300}
                  required
                  {...errorProps("deliveryAddress")}
                  className={`${errorProps("deliveryAddress").className} resize-none pl-9`}
                />
              </div>
            </Field>

            <Field
              label="Nearest landmark"
              hint="Optional"
              htmlFor={`${id}-landmark`}
              errorId={`${id}-landmark-error`}
              error={fieldErrors?.landmark}
            >
              <input
                id={`${id}-landmark`}
                name="landmark"
                defaultValue={saved.landmark}
                placeholder="e.g. Near City Hospital"
                maxLength={120}
                {...errorProps("landmark")}
              />
            </Field>
          </>
        )}

        <Field
          label="Order notes"
          hint="Optional"
          htmlFor={`${id}-notes`}
          errorId={`${id}-notes-error`}
          error={fieldErrors?.notes}
        >
          <textarea
            id={`${id}-notes`}
            name="notes"
            placeholder="Less spicy, extra ketchup, call on arrival…"
            rows={2}
            maxLength={500}
            {...errorProps("notes")}
            className={`${errorProps("notes").className} resize-none`}
          />
        </Field>

        <p className="rounded-[12px] bg-ember/[0.05] px-4 py-3 text-[12.5px] leading-[1.6] text-smoke">
          💵 Pay {orderType === "delivery" ? "cash on delivery" : "at the counter"}. We&rsquo;ll
          call or WhatsApp you on this number to confirm your order.
        </p>
      </div>

      <footer className="space-y-3 border-t border-ink/[0.07] px-5 py-5 sm:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[14px] font-semibold text-smoke">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
          </span>
          {total !== null && (
            <span className="text-[22px] font-black tabular-nums text-gradient">
              {formatPrice(total)}
            </span>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-[10px] bg-ember/[0.07] px-3.5 py-2.5 text-[13px] font-semibold text-ember-dark">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-ember px-5 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(228,0,43,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-dark disabled:translate-y-0 disabled:opacity-70"
        >
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Placing your order…
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </footer>
    </form>
  );
}
