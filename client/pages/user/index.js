import { useContext, useEffect, useState } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";
import course from "../../../server/models/course";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-danger p-5"
        />
      )}
      <h1 className="jumbotron text-center square">User dashboard</h1>

      {/* show the list of courses */}

      {courses &&
        courses.map((course) => (
          <div key={course._id} className="media pt-2 pb-1">
            <Avatar
              size={200}
              shape="square"
              style={{ borderRadius: "5px 14px 4px 10px" }}
              src={course.image ? course.image.Location : "/course.png"}
            />

            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <Link
                    href={`/user/course/${course.slug}`}
                    className="pointer"
                  >
                    <a>
                      <h5 className="mt-2 text-primary">{course.name}</h5>
                    </a>
                  </Link>
                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons.length} lessons
                  </p>
                  <p
                    className="text-muted"
                    style={{ marginTop: "-15px", fontSize: "16px" }}
                  >
                    By <b>{course.instructor.name}</b>
                  </p>
                </div>
                <div className="col-md-3 mb-5 text-center">
                  <Link href={`/user/course/${course.slug}`}>
                    <a>
                      <PlayCircleOutlined
                        className="h1 pointer text-primary"
                        style={{
                          fontSize: "3.1rem",
                        }}
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
