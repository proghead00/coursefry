import { useState, useEffect } from "react";
import Link from "next/link";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link href="/instructor">
        <a
          style={{ fontFamily: "MuseoSans" }}
          className={`nav-link ${current === "/instructor" && "active"}`}
        >
          Dashboard
        </a>
      </Link>
      <Link href="/instructor/course/create">
        <a
          style={{ fontFamily: "MuseoSans" }}
          className={`nav-link ${
            current === "/instructor/course/create" && "active"
          }`}
        >
          Create course
        </a>
      </Link>

      <Link href="/instructor/revenue">
        <a
          style={{ fontFamily: "MuseoSans" }}
          className={`nav-link ${
            current === "/instructor/revenue" && "active"
          }`}
        >
          Revenue
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
