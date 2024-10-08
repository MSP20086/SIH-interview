"use client"

import { useState, useRef, useEffect } from "react"
import { Transition } from "@headlessui/react"
import Link from "next/link"
import { useUser } from "@/app/context/user"
import { Button } from "@nextui-org/react"

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, logout } = useUser()
  const trigger = useRef(null)
  const mobileNav = useRef(null)

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNav.current || !trigger.current) return
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setMobileNavOpen(false)
    }
    document.addEventListener("click", clickHandler)
    return () => document.removeEventListener("click", clickHandler)
  })

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return
      setMobileNavOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
  })

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <div className="flex md:hidden">
      {/* Hamburger button */}
      <button
        ref={trigger}
        className={`hamburger ${mobileNavOpen && "active"}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 fill-current text-gray-900"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" />
          <rect y="11" width="24" height="2" />
          <rect y="18" width="24" height="2" />
        </svg>
      </button>

      {/* Mobile navigation */}
      <div ref={mobileNav}>
        <Transition
          show={mobileNavOpen}
          as="nav"
          id="mobile-nav"
          className="absolute top-full h-screen pb-16 z-20 left-0 w-full overflow-scroll bg-white"
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ul className="px-5 py-2">
            {!user ? (
              <>
                <li>
                  <Link
                    href="/signin"
                    className="flex font-medium w-full text-gray-600 hover:text-gray-900 py-2 justify-center"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 w-full my-2"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <span>Sign up</span>
                    <svg
                      className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                        fill="#999"
                        fillRule="nonzero"
                      />
                    </svg>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="flex flex-col space-y-2">
                {user.role === 'expert' && (
                  <Button
                    href={`/dashboard/?id=${user._id}`}
                    as={Link}
                    color="transparent"
                    className="flex items-center text-gray-600 bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded-md transition duration-150 ease-in-out"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m-6 0l-3-3V8m6 8H4a2 2 0 00-2 2v2h20v-2a2 2 0 00-2-2h-6z"
                      />
                    </svg>
                    Dashboard
                  </Button>
                )}
                <Button
                  onClick={handleLogout} // Use handleLogout instead of logout
                  className="flex items-center text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 px-4 py-2 rounded-md transition duration-150 ease-in-out"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12H4m8 8H4m8-16H4m16 8a8 8 0 11-8-8 8 8 0 018 8z"
                    />
                  </svg>
                  Log out
                </Button>
              </li>
              </>
            )}
          </ul>
        </Transition>
      </div>
    </div>
  )
}
