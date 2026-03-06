"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, updateNote, refreshCart } = useCart();
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (drawerOpen) refreshCart();
  }, [drawerOpen, refreshCart]);

  useEffect(() => {
    setNote(cart?.note ?? "");
  }, [cart?.note]);

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await updateNote(note);
    } finally {
      setSavingNote(false);
    }
  };

  const isEmpty = !cart?.lines?.length;
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-brand-ink/40 transition-opacity ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
        onClick={closeDrawer}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-brand-offwhite shadow-xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b border-brand-cream px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-brand-ink">Cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded p-2 text-brand-ink/80 hover:bg-brand-cream/50 hover:text-brand-ink"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty && (
            <p className="text-brand-ink/70">Your cart is empty.</p>
          )}
          {!isEmpty && cart?.lines && (
            <ul className="space-y-4">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4 border-b border-brand-cream/60 pb-4">
                  {line.imageUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-brand-cream/50">
                      <Image
                        src={line.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-ink line-clamp-2">{line.title}</p>
                    <p className="text-sm text-brand-ink/70">
                      Qty {line.quantity} · ${parseFloat(line.price).toFixed(2)} {line.currencyCode}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!isEmpty && (
            <div className="mt-6">
              <label htmlFor="cart-note" className="block text-sm font-medium text-brand-ink">
                Order notes (optional)
              </label>
              <p className="text-xs text-brand-ink/60 mt-0.5">
                These will be included with your order (e.g. pickup time, gift message).
              </p>
              <textarea
                id="cart-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleSaveNote}
                rows={3}
                className="mt-1.5 w-full rounded border border-brand-cream bg-white px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink/50 focus:border-brand-copper focus:outline-none focus:ring-1 focus:ring-brand-copper"
                placeholder="Add a note for your order…"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={savingNote}
                className="mt-2 text-sm font-medium text-brand-copper hover:underline disabled:opacity-50"
              >
                {savingNote ? "Saving…" : "Save note"}
              </button>
            </div>
          )}
        </div>
        <div className="border-t border-brand-cream px-6 py-4">
          {checkoutUrl && (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded bg-brand-ink py-3 text-center text-sm font-medium text-brand-offwhite hover:bg-brand-ink/90 transition-colors"
            >
              Checkout
            </a>
          )}
          <button
            type="button"
            onClick={closeDrawer}
            className="mt-2 w-full text-sm font-medium text-brand-ink/80 hover:underline"
          >
            Continue shopping
          </button>
        </div>
      </aside>
    </>
  );
}
