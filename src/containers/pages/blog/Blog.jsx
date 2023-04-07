import { connect } from "react-redux";
import Layout from "../../../hocs/layout/Layout";
import { useEffect } from "react";
import { get_categories } from "../../../redux/actions/categories/categories";
import { Helmet } from "react-helmet-async";
import {
  get_author_blog_list,
  get_author_blog_list_page,
} from "../../../redux/actions/blog/blog";
import BlogList from "../../../components/blog/BlogList";

function Blog({
  get_author_blog_list,
  get_author_blog_list_page,
  posts,
  count,
  next,
  previous,
  get_categories,
  categories,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
    get_author_blog_list();
    get_categories();
  }, []);
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
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-3xl font-medium leading-6 text-gray-900">
              Blog
            </h3>
            <p className="mt-4 text-lg text-gray-800">
              Create or edit a blog post.
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md border border-transparent bg-purple-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
            >
              Create New Post
            </button>
          </div>
        </div>
      </div>
      <BlogList
        posts={posts && posts}
        get_blog_list_page={get_author_blog_list_page}
        count={count && count}
      />
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  posts: state.blog.author_blog_list,
  categories: state.categories.categories,
  count: state.blog.count,
  next: state.blog.next,
  previous: state.blog.previous,
});
export default connect(mapStateToProps, {
  get_author_blog_list,
  get_categories,
  get_author_blog_list_page,
})(Blog);
