"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import useAuthStore from "@/authStore";
import Link from "next/link";
import axios from "axios";
import Loader from "@/components/loader";
import toast from "react-hot-toast";

const SignInPage = () => {
  const { signin, setPhotographer, user, photographer, isHydrated } =
    useAuthStore();

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/api/photographer/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      //console.log(data);

      setMessage("Sign-in successful!");
      setError("");

      signin(data.token);
      setPhotographer(data.photographer);

      router.push("/profile");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Invalid credentials. Please try again."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    if ((user || photographer) && !toastShownRef.current) {
      toastShownRef.current = true;
      router.push("/");
    }
  }, [isHydrated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] mt-5 mb-10">
      {user || photographer || !isHydrated ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader />
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full md:w-1/2 gap-4 px-5"
          >
            <h2 className="text-heading-04 font-medium text-center">
              Photographer Sign In
            </h2>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <p className="text-sm text-right">
                <Link
                  className="text-blue-500"
                  href={`/reset-pass?type=photographer${
                    formData.email ? `&email=${formData.email}` : ""
                  }`}
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <div className="mx-auto">
              {message && <p className="text-green-500">{message}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="flex flex-col items-center">
              <Button type="submit">Sign In</Button>
            </div>
          </form>
        </>
      )}

      <div className="flex flex-col items-center mt-4">
        <p>
          Don't have an account?{" "}
          <Link className="underline" href="/signup/photographer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
