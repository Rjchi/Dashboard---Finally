import Sidebar from "../../components/navegation/Sidebar";
import { connect } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import {
  check_authenticated,
  load_user,
  logout,
  refresh,
} from "../../redux/actions/auth/auth";

const Layout = ({
  children,
  refresh,
  check_authenticated,
  load_user,
  user_loading,
  isAuthenticated,
  user,
  logout,
}) => {
  useEffect(() => {
    refresh();
    check_authenticated();
    load_user();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Link to="/">
                        <img
                          width={70}
                          height={60}
                          alt="Logo"
                          src="data:image/png;base64,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"
                        />
                      </Link>
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      <Sidebar />
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                    <button onClick={e => setOpen(true)} className="group block flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            Tom Cook
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            View profile
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Link to="/">
                  <img
                    width={70}
                    height={60}
                    alt="Logo"
                    src="data:image/png;base64,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"
                  />
                </Link>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                <Sidebar />
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <button onClick={e => setOpen(true)} className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Tom Cook
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      View profile
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Payment successful
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Consequatur amet labore.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                      onClick={() => handleLogout()}
                    >
                      Log Out
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const mapStateToProps = (state) => ({
  user_loading: state.auth.user_loading,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  refresh,
  check_authenticated,
  load_user,
  logout,
})(Layout);
