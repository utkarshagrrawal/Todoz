import toast from "react-hot-toast";

export function SuccessNotify(message) {
  toast.success(message, {
    duration: 4000,
    position: "top-right",
  });
}

export function ErrorNotify(message) {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
}

export function LoadingNotify(message) {
  toast.loading(message, {
    duration: 4000,
    position: "top-right",
  });
}

export function DismissToast(toastId) {
  toast.dismiss(toastId);
}
