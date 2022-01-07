import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar, Tooltip } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    setCourses(data);
  };

  const styleBoi = { marginTop: "-15px", fontSize: "15px" };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
      {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}

      {courses &&
        courses.map((course) => (
          <>
            <div className="media pt-2">
              {/* <img
                className="pp"
                src={course.image ? course.image.Location : "/course.png"}
              ></img> */}
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <Link
                      href={`/instructor/course/view/${course.slug}`}
                      className="pointer"
                    >
                      <a className="mt-2 text-primary">
                        <h5 className="pt-2">{course.name}</h5>
                      </a>
                    </Link>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons.length} Lessons
                    </p>

                    {course.lessons.length < 3 ? (
                      <p style={styleBoi} className="text-warning">
                        At least 3 lessons are required to publish a course.
                      </p>
                    ) : course.published ? (
                      <p style={styleBoi} className="text-success">
                        Your course is live in the marketplace
                      </p>
                    ) : (
                      <p style={styleBoi} className="text-success">
                        Your course is ready to be published!
                      </p>
                    )}
                  </div>

                  <div className="col-md-3 mt-3 text-center">
                    {course.published ? (
                      <Tooltip title="published">
                        <CheckCircleOutlined className="h5 pointer text-success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not published">
                        <CloseCircleOutlined className="h5 pointer text-warning" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
