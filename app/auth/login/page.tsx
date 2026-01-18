"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/context/AuthContext";
import { signInSchema, SignInFormData } from "@/lib/validations/auth";
import Navbar from "@/app/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError("");
      setLoading(true);
      await signIn(data.email, data.password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.");
      } else if (err.code === "auth/user-disabled") {
        setError("Bu hesap askıya alınmış. Destek ile iletişime geçin.");
      } else if (err.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else {
        setError("Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.");
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
            <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[40px]">Giriş Yap</h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">Hesabınıza erişin</p>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#0071e3] py-3 text-[17px] font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center text-[14px] text-[#6e6e73]">
            Hesabınız yok mu?{" "}
            <Link href="/auth/signup" className="text-[#0071e3] hover:underline">
              Kayıt Ol
            </Link>
            </div>
            
            <div className="rounded-xl bg-[#f5f5f7] p-4">
              <p className="text-[13px] text-[#6e6e73]">
                <span className="font-medium text-[#1d1d1f]">💡 İpucu:</span> Henüz hesabınız yoksa yukarıdaki "Kayıt Ol" linkine tıklayarak hızlıca hesap oluşturabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
