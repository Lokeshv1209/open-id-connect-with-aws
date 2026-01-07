"use client";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Building from "@/../public/Building.svg";
import Globe from "@/../public/Globe.svg";
import { RightSideCardBase } from "@/components/shared-component/RightSideCardBase";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { showErrorToast } from "@/lib/toast";
import { useGetOrganizationByIdQuery } from "@/services/api-service/OrgService";

export interface IOrganization {
  organization_id: string;
  orgName: string;
  OrganizationDomains: { domainName: string }[];
  logoUrl: string;
  status: number;
  Users: [
    {
      name: string;
      email: string;
      profileUrl: string;
    },
  ];
}

export interface IProps {
  orgId?: string;
  handleClose: () => void;
  handleEdit: () => void;
}

export default function OrgDetails({ orgId, handleClose, handleEdit }: IProps) {
  const [orgDetails, setOrgDetails] = useState<IOrganization>();

  const { data, error, isLoading } = useGetOrganizationByIdQuery({ id: orgId });

  useEffect(() => {
    if (data?.data?.data) {
      setOrgDetails(data?.data?.data);
      console.info("Organization details:", data?.data?.data);
    } else if (error) {
      showErrorToast("Sorry unable to show organization");
      handleClose();
    }
  }, [data, error, handleClose]);

  return (
    <RightSideCardBase
      handleClose={handleClose}
      parentClassName="grid max-lg:grid-cols-[0.1fr_2fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[2fr_0.96fr]"
      heading="Organization Details"
      buttons={[
        {
          label: "Cancel",
          onChange: handleClose,
          variant: "gradientGray",
        },
        {
          label: "Edit",
          variant: "gradientGreen",
          onChange: handleEdit,
          children: <Pencil className="w-2 h-2" />,
        },
      ]}
    >
      <div className=" flex flex-col gap-2 p-5">
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-5 shadow-sm border border-gray-100">
          <div className="flex max-md:flex-col-reverse max-md:gap-3 max-md:items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <div className="p-1 bg-[#1EB54C0F] rounded-md flex-shrink-0">
                  <Image src={Building} alt="" className="" />
                </div>
                <div>
                  <h3 className="text-[13px] font-medium text-[#07070799]">Organization Name</h3>
                  <p className="text-sm font-medium text-[#373636]  break-all pr-3">
                    {orgDetails?.orgName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-1 bg-[#1EB54C0F] rounded-md flex-shrink-0">
                  <Image src={Globe} alt="" className="" />
                </div>
                <div>
                  <h3 className="text-[13px] font-medium text-[#07070799]">Domain</h3>
                  {orgDetails?.OrganizationDomains?.map((value, key) => {
                    return (
                      <p key={key} className="text-sm font-medium text-[#1F70C1]  break-words">
                        {value?.domainName}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex w-[6.25rem] h-[6.25rem] justify-center items-center max-md:w-full border rounded-2xl p-1 ">
              {orgDetails?.logoUrl ? (
                <div className="relative w-[5.5rem] h-[5.5rem]">
                  <Image
                    src={orgDetails?.logoUrl}
                    alt={orgDetails?.orgName || "Organization logo"}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <p className="text-xs text-[#07070799]">Empty</p>
              )}
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <Label className="text-[13px] font-medium text-gray-900">Organization Status</Label>
              <span className="text-xs text-gray-500">(Visible in app)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-900 font-medium">Is active for all users.</span>
              <div className="relative">
                <Badge
                  className={`${
                    orgDetails?.status
                      ? "bg-[#0A99521A] text-[#11A75C] "
                      : "bg-[#FF383814] text-[#FF3838]"
                  } rounded-full`}
                >
                  {orgDetails?.status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm border border-gray-100">
          <div className="flex justify-between ">
            <h2 className="text-sm font-medium ">Assigned Admins</h2>
          </div>
          <div className="bg-[#00B19305] rounded-md flex max-md:flex-col p-4 gap-2 items-center">
            {orgDetails?.Users?.length ? (
              <>
                <div className="flex-shrink-0 w-10 h-10 bg-gray-300  rounded-full flex justify-center items-center">
                  {orgDetails?.Users[0]?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col bg-white rounded-md">
                  <p className="text-sm text-[#232527] font-medium  break-words">
                    {orgDetails?.Users[0]?.email}
                  </p>
                  <p className="text-xs text-[#047B28] font-medium  break-words">
                    {orgDetails?.Users[0]?.name}
                  </p>
                </div>
              </>
            ) : (
              <h3 className="text-xs text-[#064738] font-medium">No Admins Assigned Yet</h3>
            )}
          </div>
        </div>
      </div>
      <Loader loading={isLoading} />
    </RightSideCardBase>
  );
}
