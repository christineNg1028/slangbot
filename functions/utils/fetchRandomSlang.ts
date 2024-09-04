import { SLANG_TERMS } from "../../constants/slang_terms.ts";

export function fetchRandomSlang(): string {
  return SLANG_TERMS[Math.floor(Math.random() * SLANG_TERMS.length)];
}
