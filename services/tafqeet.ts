/**
 * Tafqeet: Convert numbers into formal Arabic currency words.
 * Specifically tailored for Egyptian Pounds (جنيه مصري).
 */

const ones = [
  '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
  'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر',
  'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'
];

const tens = [
  '', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'
];

const hundreds = [
  '', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'
];

function convertGroup(n: number): string {
  if (n === 0) return '';
  
  let parts: string[] = [];
  
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  
  if (h > 0) {
    parts.push(hundreds[h]);
  }
  
  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(ones[remainder]);
    } else {
      const o = remainder % 10;
      const t = Math.floor(remainder / 10);
      if (o > 0) {
        parts.push(ones[o] + ' و' + tens[t]);
      } else {
        parts.push(tens[t]);
      }
    }
  }
  
  return parts.join(' و');
}

export function numberToArabicWords(num: number): string {
  const rounded = Math.round(num);
  if (rounded === 0) return 'صفر جنيه مصري';
  if (rounded < 0) return 'سالب ' + numberToArabicWords(-rounded);

  const billions = Math.floor(rounded / 1000000000);
  const millions = Math.floor((rounded % 1000000000) / 1000000);
  const thousands = Math.floor((rounded % 1000000) / 1000);
  const remaining = rounded % 1000;

  const parts: string[] = [];

  if (billions > 0) {
    if (billions === 1) parts.push('مليار');
    else if (billions === 2) parts.push('ملياران');
    else if (billions >= 3 && billions <= 10) parts.push(convertGroup(billions) + ' مليارات');
    else parts.push(convertGroup(billions) + ' مليار');
  }

  if (millions > 0) {
    if (millions === 1) parts.push('مليون');
    else if (millions === 2) parts.push('مليونان');
    else if (millions >= 3 && millions <= 10) parts.push(convertGroup(millions) + ' ملايين');
    else parts.push(convertGroup(millions) + ' مليون');
  }

  if (thousands > 0) {
    if (thousands === 1) parts.push('ألف');
    else if (thousands === 2) parts.push('ألفان');
    else if (thousands >= 3 && thousands <= 10) parts.push(convertGroup(thousands) + ' آلاف');
    else parts.push(convertGroup(thousands) + ' ألف');
  }

  if (remaining > 0) {
    parts.push(convertGroup(remaining));
  }

  return 'فقط ' + parts.join(' و') + ' جنيهاً مصرياً لا غير';
}
