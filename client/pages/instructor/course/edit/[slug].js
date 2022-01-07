import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  // state for lesson update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    console.log(data);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("IMAGE UPLOADED", data);
        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast("Image upload failed. Try later.");
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast("Couldn't upload image. Try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast("Course has been updated!");
      // router.push("/instructor");
    } catch (err) {
      toast(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    // console.log("DRAG ", index);

    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    // console.log("DROP ", index);

    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;

    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; // clicked/ dragged item to reorder

    allLessons.splice(movingItemIndex, 1); // remove 1 item from the given idx

    allLessons.splice(targetItemIndex, 0, movingItem); // 0 cuz we aint moving now; push the item here

    setValues({ ...values, lessons: [...allLessons] });

    // save reordered lessons in db
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });

    console.log("LESSONS REORDER ", data);
    toast("Lessons have been rearranged");
  };

  const handleDelete = async (index) => {
    const answer = window.confirm("Are you sure you want to delete?");

    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);

    // console.log("removed", removed[0]._id);
    setValues({ ...values, lessons: allLessons });

    // send request to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    toast("Lesson removed");
    console.log("LESSON DELETED ", data);
  };

  //-------------------------------------------------------------------------------
  // lesson update fn

  const handleVideo = async (e) => {
    // remove prev video
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
    }

    // upload a new video
    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);

    // send video as form data
    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);

    // save progress bar and send videos as form data to backend
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );

    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();

    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    setUploadVideoButtonText("Upload Video");
    setVisible(false);
    // toast("Lesson has been updated!");
    // setCourse(data);

    // update in ui
    // if (data.ok) { // hindering with realtime update hence commented out
    let arr = values.lessons;

    // idx of lesson to be deleted
    const index = arr.findIndex((ele) => ele._id === current._id);
    arr[index] = current;
    setValues({ ...values, lessons: arr });
    toast("Lesson has been updated!");
    // }
  };
  //-------------------------------------------------------------------------
  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>
      {/* {JSON.stringify(values)} */}
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImageRemove={handleImageRemove}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre> */}
      <hr />
      <div className="row pb-5">
        <div className="col lesson-list ss2">
          <h4>
            {values && values.lessons && values.lessons.length} lessons are
            uploaded in this course
          </h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>

                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-right"
                />
              </Item>
            )}
          ></List>
        </div>
      </div>
      <Modal
        title="Update lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
        {/* <pre> {JSON.stringify(current, null, 4)} </pre> */}
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
