import { connect } from "react-redux";
import Layout from "../../../hocs/layout/Layout";
import { useEffect, useState } from "react";
import { get_categories } from "../../../redux/actions/categories/categories";
import { Helmet } from "react-helmet-async";
import {
  get_author_blog_list,
  get_author_blog_list_page,
  get_blog,
} from "../../../redux/actions/blog/blog";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import DOMPurify from "dompurify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function EditPost({
  post,
  get_blog,
  isAuthenticated,
  get_categories,
  categories,
}) {
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    window.scrollTo(0, 0);
    get_blog(slug);
    categories ? <></> : get_categories();
  }, [slug, get_blog, get_categories, categories]);

  const [updateTitle, setUpdateTitle] = useState(false);
  const [updateSlug, setUpdateSlug] = useState(false);
  const [updateDescription, setUpdateDescription] = useState(false);
  const [updateContent, setUpdateContent] = useState(false);
  const [content, setContent] = useState("");
  const [updateCategory, setUpdateCategory] = useState(false);
  const [updateThumbnail, setUpdateThumbnail] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    new_slug: "",
    description: "",
    category: "",
  });

  const { title, new_slug, description, category } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("new_slug", new_slug);
    formData.append("description", description);
    formData.append("category", category);
    if (content) {
      formData.append("content", content);
    }else {
      formData.append("content", '');
    }
    formData.append("category", category);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/blog/edit`,
          formData,
          config
        );

        if (res.status === 200) {
          if (new_slug !== "") {
            await get_blog(new_slug);
            navigate(-1);
          } else {
            await get_blog(slug);
          }
          setFormData({
            title: "",
            new_slug: "",
            description: "",
            category: "",
          });
          setLoading(false);
          setUpdateTitle(false);
          setUpdateSlug(false);
          setUpdateDescription(false);
          setUpdateContent(false);
          setUpdateCategory(false);
          setUpdateThumbnail(false);
          if (content) {
            setContent("");
          }
        } else {
          setLoading(false);
          setUpdateTitle(false);
          setUpdateSlug(false);
          setUpdateDescription(false);
          setUpdateContent(false);
          setUpdateCategory(false);
          setUpdateThumbnail(false);
          if (content) {
            setContent("");
          }
        }
      } catch (error) {
        setLoading(false);
        setUpdateTitle(false);
        setUpdateSlug(false);
        setUpdateDescription(false);
        setUpdateContent(false);
        setUpdateCategory(false);
        setUpdateThumbnail(false);
        if (content) {
          setContent("");
        }
        alert("Error al enviar");
      }
    };
    fetchData();
  };

  return (
    <Layout>
      <Helmet>
        <title>Prototype | Admin Blog</title>
        <meta
          name="description"
          content="Prototipo pagina web react y django (con fines educativos)"
        />
        <meta
          name="keywords"
          content="react & django, react y django, full stack web developer"
        />
        <meta name="robots" content="all" />
        <link rel="canonical" href="" />
        <meta name="author" content="Richi" />
        <meta name="publisher" content="Richi" />

        {/* Social Media Tags */}
        <meta property="og:title" content="Prototype" />
        <meta
          property="og:description"
          content="Prototipo pagina web react y django (con fines educativos)."
        />
        <meta property="og:url" content="" />
        <meta property="og:image" content="" />

        <meta name="twitter:title" content="Prototype" />
        <meta
          name="twitter:description"
          content="Prototipo pagina web react y django (con fines educativos)."
        />
        <meta name="twitter:image" content="" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {post && isAuthenticated ? (
        <>
          <div>
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="text-3xl font-medium leading-6 text-gray-900">
                  Edit Post
                </h3>
                <p className="mt-4 text-lg text-gray-800">{post.title}.</p>
              </div>
              <div className="ml-4 mt-4 flex-shrink-0">
                <button
                  type="button"
                  className="relative inline-flex items-center mx-1 rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center mx-2 rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
                >
                  View Post
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateTitle ? (
                    <form onSubmit={(e) => onSubmit(e)} className="flex w-full">
                      <span className="flex-grow">
                        <input
                          value={title}
                          onChange={(e) => onChange(e)}
                          name="title"
                          type="text"
                          required
                          className="border border-gray-400 rounded-lg w-full"
                        />
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="rounded-md mr-3 bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Save
                        </button>
                        <div
                          type="button"
                          onClick={() => setUpdateTitle(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">{post.title}</span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateTitle(true)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500inline-flex "
                        >
                          Update
                        </div>
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateSlug ? (
                    <form onSubmit={(e) => onSubmit(e)} className="flex w-full">
                      <span className="flex-grow">
                        <input
                          value={new_slug}
                          onChange={(e) => onChange(e)}
                          name="new_slug"
                          type="text"
                          required
                          className="border border-gray-400 rounded-lg w-full"
                        />
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="rounded-md mr-3 bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Save
                        </button>
                        <div
                          type="button"
                          onClick={() => setUpdateSlug(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">{post.slug}</span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateSlug(true)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500inline-flex "
                        >
                          Update
                        </div>
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Thumbnail</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateThumbnail ? (
                    <form onSubmit={(e) => onSubmit(e)} className="flex w-full">
                      <span className="flex-grow">
                        <input type="file"
                          className="w-full py-4 border border-gray-500 rounded-lg"
                          name="thumbnail"
                          // onChange={}
                          required
                        />
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="rounded-md mr-3 bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Save
                        </button>
                        <div
                          type="button"
                          onClick={() => setUpdateThumbnail(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">
                        <img src={post.thumbnail} alt="IMG" className="w-full h-60 border border-gray-600" />
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateThumbnail(true)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500inline-flex "
                        >
                          Update
                        </div>
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateDescription ? (
                    <form onSubmit={(e) => onSubmit(e)} className="flex w-full">
                      <span className="flex-grow">
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => onChange(e)}
                          name="description"
                          type="text"
                          required
                          className="border border-gray-400 rounded-lg w-full"
                        />
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="rounded-md mr-3 bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Save
                        </button>
                        <div
                          type="button"
                          onClick={() => setUpdateDescription(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">{post.description}</span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateDescription(true)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500inline-flex "
                        >
                          Update
                        </div>
                      </span>
                    </>
                  )}
                </dd>
              </div>

              {/* CKEDITOR: */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Content</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateContent ? (
                    <form onSubmit={(e) => onSubmit(e)} className="w-full">
                      <span className="flex-grow">
                        <CKEditor
                          editor={ClassicEditor}
                          data={content}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                          }}
                        />
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="rounded-md mr-3 bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Save
                        </button>
                        <div
                          type="button"
                          onClick={() => setUpdateContent(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">
                        <div className="prose prose-lg max-w-4xl prose-indigo mx-auto mt-6 text-gray-700">
                          {showFullContent ? (
                            <p
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.content),
                              }}
                            />
                          ) : (
                            <p
                              dangerouslySetInnerHTML={{
                                __html:
                                  DOMPurify.sanitize(post.content.length) > 350
                                    ? DOMPurify.sanitize(
                                        post.content.slice(0, 249)
                                      )
                                    : DOMPurify.sanitize(post.content),
                              }}
                            />
                          )}
                          {showFullContent ? (
                            <button
                              className="relative inline-flex items-center mx-1 rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
                              onClick={() => setShowFullContent(false)}
                            >
                              Show Less
                            </button>
                          ) : (
                            <button
                              className="relative inline-flex items-center mx-1 rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
                              onClick={() => setShowFullContent(true)}
                            >
                              Show More
                            </button>
                          )}
                        </div>
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateContent(true)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500inline-flex "
                        >
                          Update
                        </div>
                      </span>
                    </>
                  )}
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateCategory ? (
                    <form onSubmit={(e) => onSubmit(e)} className="flex w-full">
                      <span className="flex-grow">
                        {categories &&
                          categories !== null &&
                          categories !== undefined &&
                          categories.map((category) => {
                            if (category.sub_categories.length === 0) {
                              return (
                                <div
                                  key={category.id}
                                  className="flex items-center h-5"
                                >
                                  <input
                                    onChange={(e) => onChange(e)}
                                    value={category.id.toString()}
                                    name="category"
                                    type="radio"
                                    required
                                    className="focus:ring-purple-600 h-4 w-4 text-purple-700 border-gray-300 rounded-full"
                                  />
                                  <label className="ml-3 text-sm dark:text-dark-txt text-gray-800 font-light">
                                    {category.name}
                                  </label>
                                </div>
                              );
                            } else {
                              let result = [];
                              result.push(
                                <div
                                  key={category.id}
                                  className="flex items-center h-5"
                                >
                                  <input
                                    onChange={(e) => onChange(e)}
                                    value={category.id.toString()}
                                    name="category"
                                    type="radio"
                                    required
                                    className="focus:ring-purple-600 h-4 w-4 text-purple-700 border-gray-300 rounded-full"
                                  />
                                  <label className="ml-3 text-sm dark:text-dark-txt text-gray-800 font-light">
                                    {category.name}
                                  </label>
                                </div>
                              );
                              category.sub_categories.map((sub_category) => {
                                result.push(
                                  <div
                                    key={sub_category.id}
                                    className="flex items-center h-5"
                                  >
                                    <input
                                      onChange={(e) => onChange(e)}
                                      value={sub_category.id.toString()}
                                      name="category"
                                      type="radio"
                                      required
                                      className="focus:ring-purple-600 h-4 w-4 text-purple-700 border-gray-300 rounded-full"
                                    />
                                    <label className="ml-3 text-sm dark:text-dark-txt text-gray-800 font-light">
                                      {sub_category.name}
                                    </label>
                                  </div>
                                );
                              });
                              return result;
                            }
                          })}
                      </span>
                      <span className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="rounded-md mr-3 bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Save
                        </button>
                        <div
                          type="button"
                          onClick={() => setUpdateCategory(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">{post.category.name}</span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateCategory(true)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500inline-flex "
                        >
                          Update
                        </div>
                      </span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  post: state.blog.post,
  isAuthenticated: state.auth.isAuthenticated,
  categories: state.categories.categories,
});
export default connect(mapStateToProps, {
  get_categories,
  get_blog,
})(EditPost);
