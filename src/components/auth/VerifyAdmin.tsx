"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import LockIcon from "@/../public/LockIcon.svg";
import { useAppDispatch } from "@/hooks/reduxHook";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { setPasswordSchema } from "@/lib/validation/loginSchema";
import { useActivateMutation } from "@/services/api-service/AuthService";
import { setOrgInfo, setToken, setUserInfo } from "@/store/slice/userDetails";

import { Button } from "../ui/button";
import { Label } from "../ui/label";

type LoginFormValues = {
  confirmPass: string;
  password: string;
};

export interface IProp {
  token: string | null;
}

function VerifyAdmin({ token }: IProp) {
  const dispatch = useAppDispatch();
  const [passEyeToggle, setPassEyeToggle] = useState(true);
  const [confirmEyeToggle, setConfirmEyeToggle] = useState(true);

  const router = useRouter();
  const [activate, { isLoading }] = useActivateMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(setPasswordSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (token) {
        const payload = {
          token,
          password: data?.password,
        };

        const result = await activate(payload).unwrap();

        if (result?.code == "200") {
          const { accessToken, refreshToken, userInfo, orgInfo } = result.data;
          dispatch(
            setToken({
              accessToken,
              refreshToken,
            })
          );
          dispatch(setUserInfo(userInfo));
          if (orgInfo) {
            dispatch(setOrgInfo(orgInfo));
          }
          showSuccessToast("Set Password Successfully");
          router.replace("/welcome");
        }
      } else {
        showErrorToast("Invalid Authorization");
        router.replace("/login");
      }
      reset();
    } catch (err) {
      console.error("Login failed:", err);
      reset();
    }
  };

  return (
    <div className="p-6 flex justify-center  items-center bg-cover bg-center h-screen">
      <div className="w-md z-10">
        <div className="text-white">
          <h1 className="text-2xl font-bold py-2 ">UI Welcome's you🖖</h1>
          <p className="font-semibold text-sm">
            Connect, share, and grow with your organization in a simple, distraction-free space.
          </p>
        </div>
        <div className="border bg-white rounded-4xl my-5 p-5 ">
          <div className="pt-3 ">
            <h1 className="text-center pb-1 text-[#005B44] font-bold text-lg">Set Password</h1>
            <div className="w-26 mx-auto bg-[#FED521]  rounded-2xl h-[4px] "></div>
            <p className="text-sm text-[#000000E5] font-normal text-center py-2">
              For security, please set a strong new password.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <div className="py-1">
                <Label className="py-2 text-[#253B35]">Password</Label>
                <div className="flex gap-1 border-2 border-[#0E0F111A]  p-3 rounded-md ">
                  <Image src={LockIcon} alt="" className="w-[20px]" />
                  <input
                    id="email"
                    type={`${passEyeToggle ? "password" : "text"}`}
                    {...register("password")}
                    className="outline-none border-none text-[13px] bg-transparent w-full "
                    placeholder="Enter password"
                  />
                  <div
                    onClick={() => setPassEyeToggle(!passEyeToggle)}
                    className="w-[20px] text-gray-200"
                  >
                    {passEyeToggle ? (
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
              <div className="py-1">
                <Label className="py-2 text-[#253B35]">Confirm Password</Label>
                <div className=" flex gap-1 border-2 border-[#0E0F111A]  p-3 rounded-md ">
                  <Image src={LockIcon} alt="" className="w-[20px]" />
                  <input
                    id="confirmPass"
                    type={`${confirmEyeToggle ? "password" : "text"}`}
                    {...register("confirmPass")}
                    className="border-none outline-none text-[13px] bg-transparent w-full"
                    placeholder="Re-Enter password"
                  />
                  <div
                    onClick={() => setConfirmEyeToggle(!confirmEyeToggle)}
                    className="w-[20px] text-gray-200"
                  >
                    {confirmEyeToggle ? (
                      <EyeOff className="w-4 p-0 text-[#00110D4D]" />
                    ) : (
                      <Eye className="w-4 p-0 text-[#00110D4D]" />
                    )}
                  </div>
                </div>
                {errors.confirmPass && (
                  <p className="text-red-400 text-xs">{errors.confirmPass.message}</p>
                )}
              </div>
              <div className="flex justify-center py-2">
                <Button type="submit" className="" variant="gradientGreen" isLoading={isLoading}>
                  <div className="flex gap-2">
                    <span>Complete</span>
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyAdmin;
