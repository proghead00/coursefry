// WRAPPER COMPONENT

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const StudentRoute = ({ children, showNav = true }) => {
  // state
  const [ok, setOk] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");
      //   console.log(data);
      if (data.ok) setOk(true);
    } catch (err) {
      console.log(err);
      setHidden(false);
      router.push("/login ");
    }
  };

  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex jusitfy-content-center display-1 text-primary p-5"
        />
      ) : (
        <div className="container-fluid">{children}</div>
      )}
    </>
  );
};

export default StudentRoute;
