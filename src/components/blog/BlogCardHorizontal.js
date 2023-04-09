import { Link } from "react-router-dom";
import moment from "moment";

const BlogCardHorizontal = ({ data, index }) => {
  return (
    <li>
      <Link
        to={`/blog/${data.slug}`}
        className="block relative hover:shadow-2xl rounded-lg transition duration-300 ease-in-out"
        onMouseEnter={() => {
          //   const img = document.getElementById(index);
          //   img.classList.add("object-fill");
          const title = document.getElementById(`title` + data.id);
          title.classList.add("text-purple-800");
        }}
        onMouseLeave={() => {
          // const img = document.getElementById(index);
          // img.classList.remove("object-fill");
          const title = document.getElementById(`title` + data.id);
          title.classList.remove("text-purple-800");
        }}
      >
        <div className="flex items-center my-8 sm:px-6">
          <div className="lg:flex min-w-0 lg:flex-1 items-center">
            <figure className="lg:flex-shrink-0">
              {data.thumbnail ? (
                <img
                  id={index}
                  className="h-40 lg:w-60 w-full object-cover rounded-lg"
                  src={data.thumbnail}
                  alt=""
                />
              ) : (
                <div className="animate-pulse h-40 lg:w-60 w-full object-cover rounded-lg bg-gray-300"></div>
              )}
            </figure>
            <div className="min-w-0 flex-1 px-8 p-4">
              {data.title ? (
                <p
                  id={`title` + data.id}
                  className="lg:mt-0 lg:absolute lg:top-4 leading-7 text-2xl pb-4 font-semibold text-gray-900 leading-5 transition duration-300 ease-in-out"
                >
                  {data.title.length > 100
                    ? data.title.slice(0, 99)
                    : data.title}
                </p>
              ) : (
                <p id={`title` + data.id} className="animate-pulse rounded-md lg:mt-0 lg:absolute lg:top-4 leading-7 text-2xl pb-4 font-semibold text-gray-900 leading-5 transition duration-300 ease-in-out w-72 py-2 bg-gray-300"></p>
              )}
              <div className="lg:absolute lg:top-15">
                {data.status === "published" ? (
                  <>
                    <span className="rounded-full p-1 px-2 bg-green-300 text-green-800 mt-1 font-medium text-sm">
                      Published
                    </span>{" "}
                    &middot;
                  </>
                ) : (
                  <>
                    <span className="rounded-full p-1 px-2 bg-red-300 text-red-700 mt-1 font-medium text-sm">
                      Draft
                    </span>{" "}
                    &middot;
                  </>
                )}
                {data.category && (
                  <>
                    <span className="hover:text-purple-800 mt-1 font-medium text-sm">
                      {/* <Link to={`/category/${data.category.slug}`}>
                      {data.category.name}
                    </Link> */}
                      {data.category.name}
                    </span>{" "}
                    &middot;
                  </>
                )}
                <span className="mt-1 font-medium text-sm mx-1">
                  {moment(data.published).format("LL")}
                </span>{" "}
                &middot;
                <span className="mt-1 font-medium text-sm mx-1">
                  {data.time_red} min read
                </span>
                {
                  data.description ?
                  <p className="mt-4 text-lg font-regular text-gray-800 leading-4">
                    {data.description.length > 150
                      ? data.description.slice(0, 149)
                      : data.description}
                  </p>
                  :
                  <>
                  <p className="animate-pulse w-72 h-9 rounded-md py-2 bg-gray-300 mt-4 text-lg font-regular text-gray-800 leading-4"></p>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default BlogCardHorizontal;
