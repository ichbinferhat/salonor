// Sözlük tip imzası — `tr.ts` tek doğruluk kaynağıdır. Diğer diller (en.ts vb.)
// bu tipe BİREBİR uymak zorundadır; eksik/fazla anahtar derleme hatası verir.
import type { tr } from "./dictionaries/tr";

export type Dictionary = typeof tr;
