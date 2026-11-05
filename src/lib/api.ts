"use client";
import { useEffect, useState } from "react";
import {
  Category,
  Product,
  normalizeCategory,
  normalizeProduct,
  unwrap,
} from "./normalize";

const BASE = "https://openapi.programming-hero.com/api/bazardor";
const cache = new Map<string, Promise<any>>();

export function getJSON(path: string): Promise<any> {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(BASE + path)
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .catch((e) => {
          cache.delete(path);
          throw e;
        }),
    );
  }
  return cache.get(path)!;
}

export const getCategories = async (): Promise<Category[]> =>
  unwrap(await getJSON("/categories")).map(normalizeCategory);

export const getProducts = async (category?: string): Promise<Product[]> =>
  unwrap(
    await getJSON(
      category
        ? `/products?category=${encodeURIComponent(category)}`
        : "/products",
    ),
  ).map(normalizeProduct);

export const getProduct = async (idOrSlug: string): Promise<Product> => {
  try {
    const j = await getJSON(`/products/${encodeURIComponent(idOrSlug)}`);
    const d = j?.data ?? j;
    if (
      d &&
      !Array.isArray(d) &&
      typeof d === "object" &&
      Object.keys(d).length > 1
    )
      return normalizeProduct(d);
  } catch {}
  const all = await getProducts();
  const found = all.find((p) => p.slug === idOrSlug || p.id === idOrSlug);
  if (!found) throw new Error("not found");
  return found;
};

export function useAsync<T>(fn: () => Promise<T>, deps: any[]) {
  const [state, set] = useState<{ data?: T; loading: boolean; error?: any }>({
    loading: true,
  });
  useEffect(() => {
    let alive = true;
    set({ loading: true });
    fn()
      .then((data) => alive && set({ data, loading: false }))
      .catch((error) => alive && set({ loading: false, error }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
