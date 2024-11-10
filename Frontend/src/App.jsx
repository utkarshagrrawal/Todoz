import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import toast, { Toaster, useToasterStore } from "react-hot-toast";
import { useEffect } from "react";
import ContactUs from "./pages/contactUs";
import AboutUs from "./pages/aboutUs";
import TaskHome from "./pages/tasks/taskHome";
import Profile from "./pages/profile";
import ChangePassword from "./pages/changePwd";
import NotFound from "./pages/notFound";

function App() {
  const { toasts } = useToasterStore();

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= 3) // Is toast index over limit?
      .forEach((t) => toast.remove(t.id));
  }, [toasts]);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Navigate to={"/tasks/home"} />} />
        <Route path="/tasks/:section" element={<TaskHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
