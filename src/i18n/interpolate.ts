/** "{n} salon" gibi placeholder içeren çeviri metnini değişkenlerle doldurur.
 *  Hem sunucu hem istemci bileşenlerinde kullanılabilir (saf fonksiyon). */
export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
