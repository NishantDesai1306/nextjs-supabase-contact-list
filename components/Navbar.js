import { useSessionContext, useUser } from "@supabase/auth-helpers-react/dist";
import React, { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { IconUser } from "@supabase/ui";

export default function Navbar() {
  const user = useUser();
  const router = useRouter();
  const { supabaseClient: supabase } = useSessionContext();

  const [showMenu, setShowMenu] = useState(false);
  const routes = useMemo(() => {
    let arr = [
      {
        title: 'Todos',
        route: '/todo',
      },
      {
        title: 'Contacts',
        route: '/contacts',
      }
    ];

    arr = arr.map((routeConfig) => {
      return {
        ...routeConfig,
        isActive: routeConfig.route === router.route,
      };
    });

    return arr;
  }, [router.route]);

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
    } else {
      router.push({
        pathname: "/login",
      });
    }
  }, [ supabase, router ]);

  if (!user) return null;

  return (
    <div className="absolute top-0 left-0 right-0">
      <nav className="bg-white dark:bg-gray-800  shadow">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className=" flex items-center">
              <a className="flex-shrink-0" href="/">
                {/* <img className="h-8 w-8" src="/icons/rocket.svg" alt="Workflow" /> */}
              </a>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {
                    routes.map(({ title, route, isActive }) => {
                      return (
                        <a
                          key={route}
                          className={clsx(
                            "text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium",
                            { "underline decoration-emerald-600 underline-offset-4": isActive }
                          )}
                          href={route}
                        >
                          {title}
                        </a>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            <div className="block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                        id="options-menu"
                        onClick={() => setShowMenu((bool) => !bool)}
                      >
                        <IconUser />
                      </button>
                    </div>
                    <div 
                      className={clsx(
                        "origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5",
                        {
                          "block": showMenu,
                          "hidden": !showMenu,
                        }
                      )}
                    >
                      <div
                        className="py-1 "
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <a
                          href="/profile"
                          className="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                          role="menuitem"
                        >
                          <span className="flex flex-col">
                            <div>
                              <span>Account</span>
                            </div>
                            <div>
                              <span className="text-sm text-emerald-600">
                                {user.email}
                              </span>
                            </div>
                          </span>
                        </a>
                        <a
                          href="#"
                          className="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                          role="menuitem"
                          onClick={handleLogout}
                        >
                          <span className="flex flex-col">
                            <span>Logout</span>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="h-8 w-8"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {
              routes.map(({ title, route, isActive }) => {
                return (
                  <a
                    key={route}
                    className={clsx(
                      "text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium",
                      { "underline decoration-emerald-600 underline-offset-4": isActive }
                    )}
                    href={route}
                  >
                    {title}
                  </a>
                );
              })
            }
          </div>
        </div>
      </nav>
    </div>
  );
}
