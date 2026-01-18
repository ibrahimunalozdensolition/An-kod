import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
  phoneNumber: z.string().regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(1, 'Şifre giriniz'),
});

export const phoneVerificationSchema = z.object({
  code: z.string().length(6, 'Doğrulama kodu 6 haneli olmalıdır'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;
