import toast from "react-hot-toast";

/* 🔧 CONFIG BASE */
const baseConfig = {
  duration: 4000,
  position: "bottom-right" as const,
  style: {
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
  },
};

/* ✅ SUCCESS */
const successToast = (message: string) => {
  toast.success(message, {
    ...baseConfig,
    style: {
      ...baseConfig.style,
      background: "#16a34a",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#16a34a",
    },
  });
};

/* ❌ ERROR */
const errorToast = (message: string) => {
  toast.error(message, {
    ...baseConfig,
    style: {
      ...baseConfig.style,
      background: "#dc2626",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#dc2626",
    },
  });
};

export { successToast, errorToast };