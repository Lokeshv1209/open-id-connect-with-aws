"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import LockIcon from "@/../public/LockIcon.svg";
import Message from "@/../public/Message.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { loginSchema } from "@/lib/validation/loginSchema";
import { useLoginMutation } from "@/services/api-service/AuthService";
import { setOrgInfo, setToken, setUserInfo } from "@/store/slice/userDetails";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Loader from "../ui/loader";

type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const dispatch = useAppDispatch();
  const {
    token: { accessToken },
  } = useAppSelector((state) => state.userDetails);
  const [eyeToggle, setEyeToggle] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [router, accessToken]);

  useEffect(() => {
    return () => setDashboardLoading(false);
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Determine if input is email or mobile
      const isEmail = data.email.includes("@");
      const payload = isEmail
        ? { email: data.email, password: data.password }
        : { mobile: data.email, password: data.password };

      const result = await login(payload).unwrap();

      if (result?.code == "200") {
        const { accessToken, refreshToken, userInfo, orgInfo } = result.data;

        // Update Redux store
        dispatch(setToken({ accessToken, refreshToken }));
        dispatch(setUserInfo(userInfo));
        if (orgInfo) {
          dispatch(setOrgInfo(orgInfo));
        }

        showSuccessToast("Login Successfully");
        setDashboardLoading(true);

        // Navigate based on role
        const route =
          userInfo?.role === "super_admin"
            ? "/dashboard"
            : userInfo?.role === "org_admin"
              ? "/questionnaires"
              : "/login";

        router.push(route);
      } else {
        showErrorToast(result?.data?.message || "Login Failed");
      }
      reset();
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Login Failed";
      showErrorToast(errorMessage);
      reset();
    }
  };

  return (
    <div className="p-6 flex justify-center  items-center bg-cover bg-center h-screen">
      <div className="w-md z-10">
        <div className="text-white">
          <h1 className="text-2xl font-bold py-2 ">Thor Welcome's you</h1>
          <p className="font-semibold text-sm">
            Connect, share, and grow with your organization in a simple, distraction-free space.
          </p>
        </div>
        <div className="border bg-white rounded-4xl my-5 p-5 ">
          <div className="pt-3 ">
            <h1 className="text-center pb-1 text-[#005B44] font-bold text-lg">Login</h1>
            <div className="w-15 mx-auto bg-[#FED521]  rounded-2xl h-[4px] "></div>
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <div className="py-1">
                <Label className="py-2">Email</Label>
                <div className="flex gap-1 border-2 h-[3rem] border-[#0E0F111A] items-center  p-3 rounded-md ">
                  <Image src={Message} alt="" className="w-[20px]" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          id="email"
                          type="text"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value.trim().toLowerCase())}
                          className="outline-none border-none text-[13px] bg-transparent w-full "
                          placeholder="Enter email address"
                        />
                      );
                    }}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
              </div>
              <div className="py-1">
                <Label className="py-2">Password</Label>
                <div className=" flex gap-1 border-2 h-[3rem] border-[#0E0F111A] items-center  p-3 rounded-md ">
                  <Image src={LockIcon} alt="" className="w-[20px]" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          id="password"
                          type={`${eyeToggle ? "password" : "text"}`}
                          value={field.value}
                          onChange={field.onChange}
                          className="border-none outline-none text-[13px] bg-transparent w-full"
                          placeholder="Enter password"
                        />
                      );
                    }}
                  />
                  <div onClick={() => setEyeToggle(!eyeToggle)} className="w-[20px] text-gray-200">
                    {eyeToggle ? (
                      <EyeOff className="w-4 p-0 text-[#00110D4D]" />
                    ) : (
                      <Eye className="w-4 p-0 text-[#00110D4D]" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs">{errors.password.message}</p>
                )}
              </div>
              <div className="flex justify-end text-sm py-1">
                {/* <div className="flex items-center gap-1">
                  <Checkbox className="rounded-2xl" />
                  Remember me
                </div> */}
                {/* <Link href="" className="text-[#FED521]">
                  Forgot Password?
                </Link> */}
              </div>
              <div className="flex justify-center py-2">
                <Button type="submit" className="" variant="gradientGreen" isLoading={isLoading}>
                  <div className="flex gap-2 items-center">
                    <span>Login</span>
                    <ArrowRight />
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Loader loading={dashboardLoading} />
    </div>
  );
}

export default Login;
