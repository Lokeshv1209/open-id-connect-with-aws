import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { ToasterBubble, ToasterErrorIcon, ToasterSuccessIcon } from "../../../public/SvgIcons";

interface CustomToastProps {
  type: "success" | "error";
  title: string;
  message?: string;
  onClose?: () => void;
  duration?: number;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  type,
  title,
  message,
  onClose,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100);
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose?.();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const colors = {
    success: {
      bgColorFrom: "from-[#E2FFF1]",
      bgColorTo: "to-[#FAFFFD]",
      text: "text-[#005E38]",
      color: "#005E38",
      bgColor: "bg-[#005E38]",
      toasterIcon: <ToasterSuccessIcon color="#005E38" />,
    },
    error: {
      bgColorFrom: "from-[#FFE5E8]",
      bgColorTo: "to-[#FFEDEE]",
      text: "text-[#99004C]",
      color: "#99004C",
      bgColor: "bg-[#99004C]",
      toasterIcon: <ToasterErrorIcon color="#99004D" />,
    },
  };

  return (
    <div className="relative">
      <div
        className={`bg-gradient-to-b ${colors[type].bgColorFrom} ${colors[type].bgColorTo} rounded-lg shadow-lg p-4 min-w-[350px] min-h-[5.8rem] relative top-5 overflow-hidden`}
      >
        <div className="flex  items-start gap-3">
          <div className="absolute bottom-0 left-0 z-10">
            <ToasterBubble color={colors[type].color} />
          </div>

          <div className="flex-1 pl-18">
            <h3 className={`font-medium text-xl ${colors[type].text}`}>{title}</h3>
            {message && <p className={`text-sm font-normal ${colors[type].text}`}>{message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className={`${colors[type].text} transition-colors`}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
          <div
            className={`h-full ${colors[type].bgColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className={` absolute -top-3 left-4`}>{colors[type].toasterIcon}</div>
    </div>
  );
};
