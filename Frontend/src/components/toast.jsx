import toast from "react-hot-toast";

export function SuccessNotify(message) {
  return toast.success(message, {
    duration: 4000,
    position: "top-right",
  });
}

export function ErrorNotify(message) {
  return toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
}

export function LoadingNotify(message) {
  return toast.loading(message, {
    position: "top-right",
  });
}

export function DismissToast(toastId) {
  return toast.dismiss(toastId);
}
