"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/context/AuthContext";
import { phoneVerificationSchema, PhoneVerificationFormData } from "@/lib/validations/auth";
import Navbar from "@/app/components/Navbar";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any;
  }
}

export default function VerifyPhonePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.phoneVerified) {
      router.push("/dashboard");
      return;
    }

    setupRecaptcha();
  }, [user, router]);

  useEffect(() => {
    if (codeSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeSent, resendTimer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
      });
    }
  };

  const sendVerificationCode = async () => {
    if (!user) return;

    try {
      setError("");
      setLoading(true);
      
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, user.phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      
      setCodeSent(true);
      setResendTimer(60);
    } catch (err: any) {
      console.error(err);
      setError("Doğrulama kodu gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PhoneVerificationFormData) => {
    if (!user) return;

    try {
      setError("");
      setLoading(true);

      const result = await window.confirmationResult.confirm(data.code);

      await updateDoc(doc(db, 'users', user.uid), {
        phoneVerified: true,
        updatedAt: new Date(),
      });

      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-verification-code") {
        setError("Doğrulama kodu hatalı");
      } else {
        setError("Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfd] px-4 pt-[48px]">
      <div className="w-full max-w-md">
          <div className="animate-fade-in-up mb-8 text-center">
            <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[40px]">Telefon Doğrulama</h1>
            <p className="mt-2 text-[17px] leading-[1.47] text-[#6e6e73]">
            {user.phoneNumber} numarasına gönderilen kodu giriniz
          </p>
        </div>

          <div className="animate-fade-in-up animate-delay-100 rounded-2xl bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-[14px] text-red-600">
              {error}
            </div>
          )}

          {!codeSent ? (
            <div className="space-y-5">
              <p className="text-[14px] text-[#6e6e73]">
                Telefon numaranızı doğrulamak için SMS ile bir kod göndereceğiz.
              </p>
              <button
                onClick={sendVerificationCode}
                disabled={loading}
                className="w-full rounded-full bg-[#0071e3] py-3 text-[17px] font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
              >
                {loading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="code" className="mb-2 block text-[14px] font-medium text-[#1d1d1f]">
                  Doğrulama Kodu
                </label>
                <input
                  {...register("code")}
                  type="text"
                  id="code"
                  maxLength={6}
                  className="w-full rounded-lg border border-[#d2d2d7] px-4 py-3 text-center text-[24px] tracking-widest outline-none transition-colors focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
                  placeholder="000000"
                />
                {errors.code && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.code.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#0071e3] py-3 text-[17px] font-medium text-white transition-colors hover:bg-[#0077ed] disabled:opacity-50"
              >
                {loading ? "Doğrulanıyor..." : "Doğrula"}
              </button>

              {resendTimer > 0 ? (
                <p className="text-center text-[14px] text-[#6e6e73]">
                  Yeni kod gönderebilmek için {resendTimer} saniye bekleyin
                </p>
              ) : (
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className="w-full text-[14px] text-[#0071e3] hover:underline"
                >
                  Kodu Tekrar Gönder
                </button>
              )}
            </form>
          )}
        </div>

        <div id="recaptcha-container"></div>
      </div>
    </div>
    </>
  );
}
