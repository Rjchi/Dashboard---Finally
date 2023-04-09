import { connect } from "react-redux";
import Layout from "../../../hocs/layout/Layout";
import { useEffect, useState, Fragment } from "react";
import { get_categories } from "../../../redux/actions/categories/categories";
import { Helmet } from "react-helmet-async";
import { get_blog } from "../../../redux/actions/blog/blog";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();

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
  const [updateTime, setUpdateTime] = useState(false);
  const [updateCategory, setUpdateCategory] = useState(false);
  const [updateThumbnail, setUpdateThumbnail] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    new_slug: "",
    description: "",
    category: "",
    time_red: "",
  });

  const { title, new_slug, description, category, time_red } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [previewImage, setPreviewImage] = useState();
  const [thumbnail, setThumbnail] = useState();

  // Thumbnail:
  const fileSelectedHandler = (e) => {
    // Tomamos el primer archivo
    const file = e.target.files[0];
    //  Leemos la informacion de la imagen
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      setPreviewImage(reader.result);
    };
    setThumbnail(file);
  };

  const resetStates = () => {
    if (formData.title !== "") {
      setFormData({
        title: "",
      });
      setUpdateTitle(false);
    }
    if (formData.new_slug !== "") {
      setFormData({
        new_slug: "",
      });
      setUpdateSlug(false);
    }
    if (formData.description !== "") {
      setFormData({
        description: "",
      });
      setUpdateDescription(false);
    }
    setUpdateContent(false);
    setUpdateTime(false);
    setUpdateCategory(false);
    setUpdateThumbnail(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: "application/json",
        // Esto lo agregamos para poder mandar los datos de la imagen
        "Content-Type": "multipart/form-data",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("new_slug", new_slug);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("time_red", time_red);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail, thumbnail.name);
    } else {
      formData.append("thumbnail", "");
    }
    if (content) {
      formData.append("content", content);
    } else {
      formData.append("content", "");
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
            content: "",
            category: "",
            time_red: "",
          });
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        } else {
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        }
      } catch (error) {
        setLoading(false);
        resetStates();
        if (thumbnail) {
          setThumbnail(null);
          setPreviewImage(null);
        }
        if (content) {
          setContent("");
        }
        alert("Error al enviar");
      }
    };
    fetchData();
  };

  const onSubmitDraft = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const formData = new FormData();
    formData.append("slug", slug);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/blog/draft`,
          formData,
          config
        );

        if (res.status === 200) {
          setOpen(false);
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
            content: "",
            category: "",
          });
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        } else {
          setOpen(false);
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        }
      } catch (error) {
        setOpen(false);
        setLoading(false);
        resetStates();
        if (thumbnail) {
          setThumbnail(null);
          setPreviewImage(null);
        }
        if (content) {
          setContent("");
        }
        alert("Error al enviar");
      }
    };
    fetchData();
  };

  const onSubmitPublish = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const formData = new FormData();
    formData.append("slug", slug);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/blog/publish`,
          formData,
          config
        );

        if (res.status === 200) {
          setOpen(false);
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
            content: "",
            category: "",
          });
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        } else {
          setOpen(false);
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        }
      } catch (error) {
        setOpen(false);
        setLoading(false);
        resetStates();
        if (thumbnail) {
          setThumbnail(null);
          setPreviewImage(null);
        }
        if (content) {
          setContent("");
        }
        alert("Error al enviar");
      }
    };
    fetchData();
  };

  const onSubmitDelete = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const formData = new FormData();
    formData.append("slug", slug);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/blog/delete/${slug}`,
          formData,
          config
        );

        if (res.status === 200) {
          navigate(-1);
        } else {
          setOpen(false);
          setLoading(false);
          resetStates();
          if (thumbnail) {
            setThumbnail(null);
            setPreviewImage(null);
          }
          if (content) {
            setContent("");
          }
        }
      } catch (error) {
        setOpen(false);
        setLoading(false);
        resetStates();
        if (thumbnail) {
          setThumbnail(null);
          setPreviewImage(null);
        }
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
                <p className="mt-4 text-lg text-gray-800">
                  {post.title ? <>{post.title}</> : <>...</>}
                </p>
              </div>
              <div className="ml-4 mt-4 flex-shrink-0">
                <button
                  onClick={(e) => setOpenDelete(true)}
                  className="relative inline-flex items-center mx-1 rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
                >
                  Delete
                </button>
                <a
                  href={`${process.env.REACT_APP_URL}/blog/${post.slug}`}
                  target="_blank"
                  className="relative inline-flex items-center mx-2 rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
                >
                  View Post
                </a>
                <button
                  onClick={(e) => setOpen(true)}
                  className="relative inline-flex items-center rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
                >
                  {post.status === "published" ? <>Draft</> : <>Publish</>}
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

              {/* THUMBNAIL */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Thumbnail</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateThumbnail ? (
                    <>
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="IMG"
                          className="object-cover w-65 h-60 p-4 border border-gray-600"
                        />
                      )}
                      <form
                        onSubmit={(e) => onSubmit(e)}
                        className="flex w-full"
                      >
                        <span className="flex-grow">
                          <input
                            type="file"
                            className="w-full py-4 border border-gray-500 rounded-lg"
                            name="thumbnail"
                            onChange={(e) => fileSelectedHandler(e)}
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
                            onClick={() => {
                              setUpdateThumbnail(false);
                              setThumbnail(null);
                              setPreviewImage(null);
                            }}
                            className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                          >
                            Cancel
                          </div>
                        </span>
                      </form>
                    </>
                  ) : (
                    <>
                      <span className="flex-grow">
                        {post.thumbnail && (
                          <img
                            src={post.thumbnail}
                            alt="IMG"
                            className="object-cover w-full h-60 border border-gray-600"
                          />
                        )}
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
                        {post.content ? (
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
                                    DOMPurify.sanitize(post.content.length) >
                                    350
                                      ? DOMPurify.sanitize(
                                          post.content.slice(0, 249)
                                        )
                                      : DOMPurify.sanitize(post.content),
                                }}
                              />
                            )}
                            {DOMPurify.sanitize(post.content.length) > 350 ? (
                              <>
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
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        ) : (
                          <p className="animate-pulse w-72 h-9 rounded-md py-2 bg-gray-300 mt-4 text-lg font-regular text-gray-800 leading-4"></p>
                        )}
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
                <dt className="text-sm font-medium text-gray-500">Time Read</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {updateTime ? (
                    <form onSubmit={(e) => onSubmit(e)} className="flex w-full">
                      <span className="flex-grow">
                        <input
                          value={time_red}
                          onChange={(e) => onChange(e)}
                          name="time_red"
                          type="number"
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
                          onClick={() => setUpdateTime(false)}
                          className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-purple-800"
                        >
                          Cancel
                        </div>
                      </span>
                    </form>
                  ) : (
                    <>
                      <span className="flex-grow">{post.time_red}</span>
                      <span className="ml-4 flex-shrink-0">
                        <div
                          type="button"
                          onClick={() => setUpdateTime(true)}
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
                      <span className="flex-grow">
                        {post.category ? (
                          <>{post.category.name}</>
                        ) : (
                          <p className="animate-pulse w-72 h-9 rounded-md py-2 bg-gray-300 mt-4 text-lg font-regular text-gray-800 leading-4"></p>
                        )}
                      </span>
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

          {/* btnDraft-Publish */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                      <div>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                          {post.title &&
                          post.description &&
                          post.slug &&
                          post.content &&
                          post.category ? (
                            <CheckIcon
                              className="h-6 w-6 text-green-600"
                              aria-hidden="true"
                            />
                          ) : (
                            <XMarkIcon
                              className="h-6 w-6 text-red-600"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            {post.status === "published" ? (
                              <span>Draft this post?</span>
                            ) : (
                              <span>Publish this post?</span>
                            )}
                          </Dialog.Title>
                          <div className="mt-2">
                            {post.title &&
                            post.description &&
                            post.slug &&
                            post.content &&
                            post.category ? (
                              <></>
                            ) : (
                              <p className="text-sm text-gray-500">
                                To publish this post you must add: Title, Slug,
                                Description, Content, and Category.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {post.title &&
                        post.description &&
                        post.slug &&
                        post.content &&
                        post.category && (
                          <>
                            {post.status === "published" ? (
                              <form
                                onSubmit={(e) => onSubmitDraft(e)}
                                className="mt-5 sm:mt-6"
                              >
                                <button
                                  type="submit"
                                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                >
                                  <span>Draft</span>
                                </button>
                              </form>
                            ) : (
                              <form
                                onSubmit={(e) => onSubmitPublish(e)}
                                className="mt-5 sm:mt-6"
                              >
                                <button
                                  type="submit"
                                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                >
                                  <span>Publish</span>
                                </button>
                              </form>
                            )}
                          </>
                        )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* btnDelete */}
          <Transition.Root show={openDelete} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpenDelete}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                      <div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            <span>Delete Post</span>
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you wish to delete this post?
                            </p>
                          </div>
                        </div>
                      </div>
                      {
                        post.slug && (
                          <>
                            <form
                              onSubmit={(e) => onSubmitDelete(e)}
                              className="mt-5 sm:mt-6"
                            >
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                              >
                                <span>Delete</span>
                              </button>
                            </form>
                          </>
                        )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
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
