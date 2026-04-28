import toast from "react-hot-toast";
import Swal from "sweetalert2";

/* CONFIG BASE */
const baseConfig = {
  duration: 4000,
  position: "bottom-right" as const,
  style: {
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
  },
};

/* SUCCESS */
const successToast = (message: string) => {
  Swal.fire({
    text: message,
    icon: "success",
    timer: 800, 
    showConfirmButton: false,
  });
};

/* ERROR */
const errorToast = (message: string) => {
  Swal.fire({
    text: message,
    icon: "error",
    toast: true,
    position: "top-end",
    timer: 800,
    showConfirmButton: false,
  });
};

export { successToast, errorToast };
