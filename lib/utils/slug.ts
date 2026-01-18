export function generateSlug(name: string): string {
  const turkishChars: Record<string, string> = {
    'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ç': 'c', 'Ç': 'C',
  };

  let slug = name.toLowerCase();
  
  for (const [turkish, latin] of Object.entries(turkishChars)) {
    slug = slug.replace(new RegExp(turkish, 'g'), latin);
  }

  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const uniqueId = Math.random().toString(36).substring(2, 8);
  
  return `${slug}-${uniqueId}`;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
