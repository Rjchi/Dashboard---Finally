import { connect } from "react-redux";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import {
  check_authenticated,
  load_user,
  login,
  refresh,
} from "../../redux/actions/auth/auth";
import { Link, Navigate } from "react-router-dom";

function Home({
  login,
  isAuthenticated,
  loading,
  refresh,
  check_authenticated,
  load_user,
}) {
  useEffect(() => {
    isAuthenticated ? (
      <></>
    ) : (
      <>
        {refresh()}
        {check_authenticated()}
        {load_user()}
      </>
    );
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Con esto guardamos las credenciales en el formData:
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return (
      <Navigate to="/dashboard" />
    );
  }

  return (
    <div>
      <>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                width={70}
                height={60}
                alt="Logo"
                src="data:image/png;base64,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"
              />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              className="mt-8 space-y-6"
              action="#"
              method="POST"
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                    type="email"
                    // autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => onChange(e)}
                    type="password"
                    // autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot_password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});
export default connect(mapStateToProps, {
  login,
  refresh,
  check_authenticated,
  load_user,
})(Home);
