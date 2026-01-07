import { toast } from "sonner";

import { CustomToast } from "@/components/shared-component/CustomToast";

export const showSuccessToast = (title: string, message?: string) => {
  toast.custom(
    (t) => (
      <CustomToast
        type="success"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t)}
        duration={5000}
      />
    ),
    {
      duration: 5000,
      className: "!bg-transparent !border-none !shadow-none",
    }
  );
};

export const showErrorToast = (title: string, message?: string) => {
  toast.custom(
    (t) => (
      <CustomToast
        type="error"
        title={title}
        message={message}
        onClose={() => toast.dismiss(t)}
        duration={5000}
      />
    ),
    {
      duration: 5000,
      className: "!bg-transparent !border-none !shadow-none",
    }
  );
};
