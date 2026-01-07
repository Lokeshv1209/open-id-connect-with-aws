"use client";
import Image from "next/image";
import React, { useState } from "react";

import PencilSimple from "@/../public/PencilSimple.svg";
import { CenterPopUp } from "@/components/shared-component/CenterPopUp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showSuccessToast } from "@/lib/toast";
import { useDeleteOrganizationByIdMutation } from "@/services/api-service/OrgService";
import type { Organization } from "@/types/organization.types";

import AddOrg from "../side-popup/AddOrg";
import OrgDetails from "../side-popup/OrgDetails";

export interface ICompany {
  companyName: string;
  shortName: string;
  domain: string;
  status: "Active" | "Inactive";
  assignedAdmins: number;
  orgId?: string;
}

export interface IProp {
  orgData: Organization[];
}

export default function OrgCards({ orgData }: IProp) {
  const [selectedOrgId, setSelectedOrgId] = useState<Organization>();
  const [openOrgDetails, setOpenOrgDetails] = useState(false);
  const [editOrgOpen, setEditOrgOpen] = useState(false);
  const [openDeleteOrg, setOpenDeleteOrg] = useState(false);
  const [deleteOrganizationById, { isLoading: deleteLoading }] =
    useDeleteOrganizationByIdMutation();

  const handleDelete = async (orgId: string) => {
    const res = await deleteOrganizationById({ orgId });
    if (res?.data?.code == 200) {
      showSuccessToast("Organization deleted successfully");
      setOpenDeleteOrg(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3  gap-4 p-6">
      {orgData?.map((orgDetails, key) => {
        return (
          <div
            key={key}
            className="bg-white rounded-xl shadow-sm border flex flex-col gap-5 border-gray-100 p-6 w-full"
          >
            <div className="flex items-start py-2 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col flex-shrink-0 gap-0.5">
                  {orgDetails?.logoUrl ? (
                    <div className="relative w-10 h-10">
                      <Image
                        src={orgDetails?.logoUrl}
                        alt={orgDetails?.name || "Organization logo"}
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-300  rounded-full flex justify-center items-center">
                      {orgDetails?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-medium text-[#434343] truncate ">
                    {orgDetails?.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate ">
                    {orgDetails?.OrganizationDomains[0]?.domainName}
                  </p>
                </div>
              </div>
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

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setOpenOrgDetails(true);
                  setSelectedOrgId(orgDetails);
                }}
                className="flex-1 text-md py-3.5"
                variant="gradientGreen"
              >
                View Details
              </Button>
              <Button
                onClick={() => {
                  setEditOrgOpen(true);
                  setSelectedOrgId(orgDetails);
                }}
                variant="noOutline"
                size="icon"
                className="shadow-inner shadow-lg  rounded-md bg-gray-200  text-[#064738]"
              >
                <Image src={PencilSimple} alt="edit" className="w-4 h-4 text-[#044036]" />
              </Button>
              {/* <Button
                onClick={() => {
                  setOpenDeleteOrg(true);
                  setSelectedOrgId(orgDetails);
                }}
                variant="noOutline"
                size="icon"
                className="  bg-[#E9221514] shadow-inner shadow-lg  rounded-md "
              >
                <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
              </Button> */}
            </div>
          </div>
        );
      })}
      {openOrgDetails && (
        <OrgDetails
          handleClose={() => setOpenOrgDetails(false)}
          orgId={selectedOrgId?.organizationId}
          handleEdit={() => setEditOrgOpen(true)}
        />
      )}
      {editOrgOpen && (
        <AddOrg orgId={selectedOrgId?.organizationId} handleClose={() => setEditOrgOpen(false)} />
      )}
      {openDeleteOrg && (
        <CenterPopUp
          onClose={() => setOpenDeleteOrg(false)}
          buttons={[
            {
              label: "Cancel",
              variant: "gradientGray",
              onClick: () => setOpenDeleteOrg(false),
            },
            {
              label: "Delete",
              variant: "delete",
              isLoading: deleteLoading,
              onClick: () => handleDelete(selectedOrgId?.organizationId as string),
            },
          ]}
          heading="Confirm Delete Organization"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              {selectedOrgId?.logoUrl ? (
                <div className="relative w-10 h-10">
                  <Image
                    src={selectedOrgId?.logoUrl}
                    alt={selectedOrgId?.name || "Organization logo"}
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-300  rounded-full flex justify-center items-center">
                  {selectedOrgId?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className=" ">
              <h3 className="text-md font-medium text-[#434343]">{selectedOrgId?.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedOrgId?.OrganizationDomains[0]?.domainName}
              </p>
            </div>
          </div>
        </CenterPopUp>
      )}
    </div>
  );
}
