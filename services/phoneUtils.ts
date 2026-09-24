/**
 * Formats Egyptian phone number to international format for WhatsApp (e.g. 201012345678)
 */
export function formatEgyptianPhone(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.replace(/\D/g, '');
  
  // If already starts with 20 and has 12 digits (e.g. 201012345678)
  if (cleaned.startsWith('20') && cleaned.length === 12) {
    return cleaned;
  }
  
  // If standard Egyptian mobile with leading 0 (010, 011, 012, 015 - 11 digits)
  if (cleaned.startsWith('01') && cleaned.length === 11) {
    return '2' + cleaned; // 2010xxxxxxxx
  }
  
  // If entered without leading 0 (10, 11, 12, 15 - 10 digits)
  if (cleaned.startsWith('1') && cleaned.length === 10) {
    return '20' + cleaned;
  }
  
  return cleaned;
}
