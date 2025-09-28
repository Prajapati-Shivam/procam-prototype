export const generateUniqueCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateVolunteerUID = (): string => {
  const prefix = 'VOL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const formatCode = (code: string): string => {
  return code.match(/.{1,4}/g)?.join('-') || code;
};

export const validateGroupCode = (code: string): boolean => {
  const cleanCode = code.replace(/-/g, '');
  return /^[A-Z0-9]{8}$/.test(cleanCode);
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};