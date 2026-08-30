/**
 * Converts Western digits to standard Persian digits.
 */
export function toPersianDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = input.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Formats numeric price into standard Iranian Toman notation with thousand separators.
 * e.g. 385000 -> "۳۸۵,۰۰۰ تومان"
 */
export function formatToman(price: number): string {
  const formattedWithCommas = price.toLocaleString('fa-IR');
  return `${formattedWithCommas} تومان`;
}

/**
 * Helper to smoothly scroll to category element inside menu
 */
export function scrollToCategory(categoryId: string, offset = 110) {
  const element = document.getElementById(`category-${categoryId}`);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}
