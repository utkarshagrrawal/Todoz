import { useEffect, useState } from "react";
import Header from "../components/header";
import axios from "axios";

export default function Home() {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        setUserDetails({});
      });
  }, []);

  return <Header userDetails={userDetails} />;
}
