import { Routes, Route, useLocation } from "react-router-dom";

import Error404 from "../../containers/errors/Error404";
import Blog from "../../containers/pages/blog/Blog";
import Dashboard from "../../containers/pages/Dashboard";
import Home from "../../containers/pages/Home";
import ResetPassword from "../../containers/auth/ResetPassword";
import ResetPasswordConfirm from "../../containers/auth/ResetPasswordConfirm";
import EditPost from "../../containers/pages/blog/EditPost";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="*" element={<Error404 />}></Route>
      <Route path="/" element={<Home />}></Route>
      <Route path="/forgot_password" element={<ResetPassword />}></Route>
      <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/blog" element={<Blog />}></Route>
      <Route path="/blog/:slug" element={<EditPost />}></Route>
    </Routes>
  );
};

export default AnimatedRoutes;
