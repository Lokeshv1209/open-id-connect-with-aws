"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { RightSideCardBase } from "@/components/shared-component/RightSideCardBase";
import Loader from "@/components/ui/loader";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { createOrgSchema } from "@/lib/validation/createOrgSchema";
import {
  useCreateOrgMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrgMutation,
} from "@/services/api-service/OrgService";

import type { IColumns } from "../Org";
import { AdminSection } from "./components/AdminSection";
import { DomainSection } from "./components/DomainSection";
import { OrgFormSection } from "./components/OrgFormSection";

const defaultUserForm: IColumns = {
  adminName: "",
  orgName: "",
  orgDomain: [{ value: "", edit: true }],
  adminEmail: "",
  iconUrl: null,
  status: 0,
};

export interface IImageData {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface IProps {
  orgId?: string;
  handleClose: () => void;
}

function AddOrg({ orgId, handleClose }: IProps) {
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IColumns>({
    resolver: yupResolver(createOrgSchema) as any,
    defaultValues: defaultUserForm,
  });

  const {
    fields: DomainField,
    append: appendDomain,
    remove: removeDomain,
  } = useFieldArray({
    control,
    name: "orgDomain",
  });

  const [createOrg, { isLoading: createLoading }] = useCreateOrgMutation();
  const [updateOrg, { isLoading: updateLoading }] = useUpdateOrgMutation();

  const {
    data: orgData,
    error: orgError,
    isLoading: orgFetchLoading,
  } = useGetOrganizationByIdQuery({ id: orgId! }, { skip: !orgId });

  useEffect(() => {
    if (orgError) {
      showErrorToast("Sorry unable to edit");
      handleClose();
      return;
    }

    if (!orgId || !orgData?.data) return;

    const d = orgData?.data?.data;

    reset({
      orgName: d?.orgName,
      orgDomain: d?.OrganizationDomains?.map((value: { domainName: string }) => {
        return { value: value?.domainName, edit: false };
      }),
      adminName: d?.Users[0]?.name,
      adminEmail: d?.Users[0]?.email,
      iconUrl: d?.logoUrl,
      status: d?.status,
    });
  }, [orgData, orgId, orgError, handleClose, reset]);

  const onSubmit = async (data: IColumns) => {
    try {
      const formData = new FormData();
      formData.append("name", data.orgName);
      formData.append("adminEmail", data.adminEmail);
      formData.append("adminName", data.adminName);
      data.orgDomain?.map((value) => formData.append("domains[]", value?.value));

      if (data.iconUrl) {
        formData.append("iconUrl", data.iconUrl);
      }

      let res;
      if (orgId) {
        formData.append("organizationId", orgId);
        res = await updateOrg(formData);
      } else {
        if (data.status) formData.append("status", data.status.toString());
        res = await createOrg(formData);
      }

      if (res?.data?.code == 200) {
        showSuccessToast("Organization Updated Successfully");
        handleClose();
      } else if (res?.data?.code == 201) {
        showSuccessToast("Organization created Successfully");
        handleClose();
      } else if (res?.error && "data" in res.error) {
        const errorData = res.error.data as any;
        if (errorData?.statusCode == 400) {
          showErrorToast(errorData?.message || "Bad Request");
        }
      }
    } catch (err) {
      showErrorToast("Organization not Added");
      console.error("Error adding organization:", err);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setValue("iconUrl", file);
  };

  return (
    <RightSideCardBase
      handleClose={() => {
        reset();
        handleClose();
      }}
      parentClassName="grid max-lg:grid-cols-[0.1fr_2fr] lg:grid-cols-[1fr_1fr] xl:grid-cols-[2fr_0.96fr]"
      heading={orgId ? "Edit Organization" : "Create Organization"}
      buttons={[
        {
          label: "Cancel",
          onChange: () => {
            reset();
            handleClose();
          },
          variant: "gradientGray",
        },
        {
          label: "Save",
          variant: "gradientGreen",
          type: "submit",
          form: "addOrganization",
          isLoading: updateLoading || createLoading,
        },
      ]}
    >
      <div className=" flex flex-col gap-2 p-5">
        <form
          id="addOrganization"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <OrgFormSection
            control={control}
            errors={errors}
            orgId={orgId}
            iconUrl={getValues("iconUrl") || null}
            onFileSelect={handleFileSelect}
          />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <DomainSection
              control={control}
              errors={errors}
              fields={DomainField}
              append={appendDomain}
              remove={removeDomain}
            />
          </div>
          <AdminSection control={control} errors={errors} />
        </form>
      </div>
      <Loader loading={orgFetchLoading} />
    </RightSideCardBase>
  );
}

export default AddOrg;
