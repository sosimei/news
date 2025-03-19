"use server"

import { getArticles, getArticleById, getArticleStats } from "@/lib/json-store"

export async function fetchArticles(
  page = 1,
  limit = 20,
  filters: { source?: string; bias?: string; category?: string } = {},
) {
  const offset = (page - 1) * limit
  return getArticles(limit, offset, filters)
}

export async function fetchArticleById(id: string) {
  return getArticleById(id)
}

export async function fetchArticleStats() {
  return getArticleStats()
}

