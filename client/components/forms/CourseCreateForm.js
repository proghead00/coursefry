import { Select, Button, Avatar, Badge } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (boi) => b,
  editPage = false,
}) => {
  const children = [];
  for (let i = 385; i <= 5000; i += 125) {
    children.push(<Option key={i.toFixed(2)}>₹{i.toFixed(2)}</Option>);
  }
  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-4">
            <textarea
              name="description"
              cols="7"
              rows="7"
              value={values.description}
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row mb-4">
            <div className="col">
              <div className="form-group">
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              <div className="form-group mb-4">
                <Select
                  defaultValue="₹385"
                  style={{ widht: "100%", paddingRight: "10px" }}
                  onChange={(v) => setValues({ ...values, price: v })}
                  tokenSeparators={[,]}
                  size="large"
                >
                  {children}
                </Select>
              </div>
            )}
          </div>

          <div className="form-group mb-4">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-row mb-4">
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left rect2 rect22">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>
            {preview && (
              <Badge
                count="X"
                onClick={handleImageRemove}
                className="pointer ss2"
              >
                <div className="mt-7">
                  <img className="pp" src={preview}></img>
                  {/* <Avatar width={200} src={preview} /> */}
                </div>
              </Badge>
            )}
            {editPage && values.image && (
              <img className="pp" src={values.image.Location}></img>
              //   <Avatar className="pp" width={200} src={} />
            )}
          </div>

          <div className="row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary rect222"
                loading={values.loading}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
