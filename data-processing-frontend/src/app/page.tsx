"use client";
import Image from "next/image";
import rightArrow from "@/assets/right-arrow.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import loading from "@/assets/loading.gif";
export default function Home() {
  const router = useRouter();
  const [captchaValue, setCaptchaValue] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageNumber, setImageNumber] = useState<number | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/api/main"); // Adjust API route as needed
        const data = await res.json();
        setImageSrc(data.image); // base64 image string
        setImageNumber(data.imageNumber); // unique image number
      } catch (error) {
        console.error("Error fetching captcha image:", error);
      }
    };
    fetchImage();
  }, []);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      captchaValue === "" ||
      captchaValue === null ||
      captchaValue.length !== 6
    ) {
      alert("Invalid Captcha");
      return;
    }
    router.replace("/thank-you");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 row-start-2 items-center sm:items-start"
      >
        <h1 className="text-center flex justify-center items-center self-center ">
          Login to Continue
        </h1>
        {imageSrc ? (
          <Image
            src={imageSrc!}
            alt="Captcha"
            width={300} // Adjust dimensions
            height={100} // Adjust dimensions
          />
        ) : (
          <Image
            src={loading}
            alt="Loading"
            className="self-center"
            width={100} // Adjust dimensions
            height={100} // Adjust dimensions
          />
        )}
        <div className="flex gap-2 items-center flex-col sm:flex-row">
          <input
            value={captchaValue}
            onChange={(e) => {
              setCaptchaValue(e.target.value);
            }}
            type="text"
            placeholder="Enter Captcha Here"
            className="p-2 px-4 rounded-md outline-none"
          />
          <button className="rounded-md bg-green-500 p-2">
            <Image src={rightArrow} alt="Enter" className="invert" width={20} />
          </button>
        </div>
      </form>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p
          className="flex font-[family-name:var(--font-geist-sans)] opacity-65 items-center gap-2 hover:underline hover:underline-offset-4"
          rel="noopener noreferrer"
        >
          All Rights Reserved © 2024
        </p>
      </footer>
    </div>
  );
}
