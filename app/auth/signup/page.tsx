"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/context/AuthContext";
import { signUpSchema, SignUpFormData } from "@/lib/validations/auth";
import Navbar from "@/app/components/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError("");
      setLoading(true);
      
      const phoneNumber = data.phoneNumber.replace(/^(\+90|0)/, '+90');
      await signUp(data.email, data.password, phoneNumber);
      
      router.push("/auth/verify-phone");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Bu e-posta adresi zaten kullanımda. Giriş yapmayı deneyin.");
      } else if (err.code === "auth/weak-password") {
        setError("Şifre çok zayıf. En az 6 karakter olmalıdır.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("E-posta/şifre girişi etkin değil. Lütfen destek ile iletişime geçin.");
      } else {
        setError("Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] px-4 pt-[48px]">
      <div className="w-full max-w-md">
          <div className="animate-fade-in-up mb-8 text-center">
            <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[40px]">Hesap Oluştur</h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">ANIKOD'a hoş geldiniz</p>
        </div>

          <div className="animate-fade-in-up animate-delay-100 rounded-2xl bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-[14px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
                E-posta Adresi
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full rounded-lg border border-[#d2d2d7] px-4 py-3 text-[17px] outline-none transition-colors focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                placeholder="ornek@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
                Telefon Numarası
              </label>
              <input
                {...register("phoneNumber")}
                type="tel"
                id="phoneNumber"
                className="w-full rounded-lg border border-[#d2d2d7] px-4 py-3 text-[17px] outline-none transition-colors focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                placeholder="05XXXXXXXXX"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-[12px] text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
                Şifre
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full rounded-lg border border-[#d2d2d7] px-4 py-3 text-[17px] outline-none transition-colors focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-[12px] text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
                Şifre Tekrar
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                id="confirmPassword"
                className="w-full rounded-lg border border-[#d2d2d7] px-4 py-3 text-[17px] outline-none transition-colors focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-[12px] text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0071e3] py-3 text-[17px] font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
            >
              {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
            </button>
          </form>

          <div className="mt-6 text-center text-[14px] text-[#6e6e73]">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/login" className="text-[#0071e3] hover:underline">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
