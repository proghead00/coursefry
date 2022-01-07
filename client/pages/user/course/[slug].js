import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";

import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  CheckCircleTwoTone,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
  InfoCircleTwoTone,
} from "@ant-design/icons";

const { Item } = Menu;

const SingleCourse = () => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });

  const [collapsed, setCollapsed] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [completedLessons, setCompletedLessons] = useState([]);

  // force state update
  const [updateState, setUpdateState] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post("/api/list-completed", {
      courseId: course._id,
    });
    console.log("completed lesson ", data);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    console.log(data);

    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncomplete = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      console.log("ALL: ", all); // all completed lessons
      const index = all.indexOf(course.lessons[clicked]._id); // true or -1
      if (index > -1) {
        all.splice(index, 1); // remove that idx only
        console.log("ALL WITHOUT REMOVED => ", all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          {/* COLLAPSE BUTTON */}
          {/* <Button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary mt-1 btn-block mb-2"
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}{" "}
            {!collapsed && "Lessons"}
          </Button> */}
          <Menu
            defaultSelectedKeys={[clicked]}
            // inlineCollapsed={collapsed}
            style={{
              height: "80vh",
              //   overflow: "scroll",
            }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title}

                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    className="float-right kek text-primary ml-4"
                  />
                ) : (
                  //   <CheckCircleFilled className="float-right kek text-primary ml-4" />
                  <InfoCircleTwoTone
                    twoToneColor="orange"
                    className="float-right kek text-danger ml-4"
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>

        <div className="col">
          {clicked !== -1 ? (
            <>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="co mt-2">
                      {/* <b className="title1">{course.lessons[clicked].title}</b> */}

                      {completedLessons.includes(
                        course.lessons[clicked]._id
                      ) ? (
                        <b
                          className="float-right pointer price-det2"
                          onClick={markIncomplete}
                        >
                          Mark as incomplete
                        </b>
                      ) : (
                        <b
                          className="float-right pointer price-det2"
                          onClick={markCompleted}
                        >
                          {" "}
                          Mark as complete
                        </b>
                      )}
                    </div>

                    <div className="wrapper mt-4">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="90%"
                        height="100%"
                        controls
                        onEnded={() => markCompleted()}
                      />
                    </div>
                  </>
                )}
              <ReactMarkdown
                source={course.lessons[clicked].content}
                className="single-post"
              />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                {/* <PlayCircleOutlined className="text-primary display-1 p-5" /> */}
                <h1>👈</h1>
                <p className="lead">
                  Click on the lessons to start with the course!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
