import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;
  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          className="mb-4 cardsie"
          cover={
            <img
              src={image.Location}
              alt={name}
              style={{
                height: "300px",
                objectFit: "cover",
                borderRadius: "11px",
              }}
              className="p-1"
            ></img>
          }
        >
          <h2>{name}</h2>
          <p>by {instructor.name}</p>

          <Badge
            count={category}
            style={{
              backgroundColor: "#4c4177",
              backgroundImage:
                " linear-gradient(315deg, #4c4177 0%, #2a5470 74%);",
            }}
            className="pb-2 mr-2"
          />
          <h4 className="pt-2">
            {paid
              ? currencyFormatter({
                  amount: price,
                  //   currency: "inr",
                })
              : "Free"}
          </h4>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
