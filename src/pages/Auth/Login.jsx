import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { RiShieldCheckLine } from "react-icons/ri";
import logoDark from "../../assets/images/logo.png";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/firms", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Check if redirected due to expired session
  useEffect(() => {
    if (location.state?.sessionExpired) {
      setError("Your session has expired. Please sign in again to continue.");
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setError("Please enter your username.");
      return;
    }

    if (!cleanPassword) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      await login({
        username: cleanUsername,
        password: cleanPassword,
        rememberMe,
      });

      // Redirect to original attempted page or default /firms
      const origin = location.state?.from?.pathname || "/firms";
      navigate(origin, { replace: true });
    } catch (err) {
      console.error("Login attempt failed:", err);
      setError(
        err?.message ||
          "Invalid username or password. Access restricted to authorized personnel."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#111111] font-sans flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Top Bar Navigation */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E8E8E4] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#555555] hover:text-black font-medium transition-colors"
        >
          <FaArrowLeft size={10} />
          <span>Back to Website</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-[#555555] font-medium tracking-wide">
          <RiShieldCheckLine className="text-[#111111]" size={15} />
          <span>Bourse Ledger Portal</span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="w-full flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#D1D1CB] rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Brand Logo & Heading */}
              <div className="text-center pb-5 mb-5 border-b border-[#EAEAE6]">
                <Link to="/" className="inline-block mb-3">
                  <img
                    src={logoDark}
                    alt="Royal Rays"
                    className="h-12 mx-auto object-contain"
                  />
                </Link>
                <h1 className="text-xl font-serif font-medium text-[#111111] tracking-tight">
                  Sign In
                </h1>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 rounded-sm bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2 font-medium">
                  <FaExclamationCircle className="text-[#DC2626] shrink-0" size={13} />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333]">
                      Username
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#777777] pointer-events-none">
                      <FaUser size={12} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter username (e.g. admin or RSDXB)"
                      disabled={isLoading}
                      autoComplete="username"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAFAF8] focus:bg-white border border-[#D1D1CB] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] rounded-sm text-xs font-medium text-[#111111] placeholder-[#999999] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#333333]">
                      Password
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#777777] pointer-events-none">
                      <FaLock size={12} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter password (e.g. admin123 or Royal@1504)"
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="w-full pl-9 pr-10 py-2.5 bg-[#FAFAF8] focus:bg-white border border-[#D1D1CB] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] rounded-sm text-xs font-medium text-[#111111] placeholder-[#999999] outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#777777] hover:text-black p-1 cursor-pointer transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded-xs border-[#CCCCCC] text-black focus:ring-black cursor-pointer"
                    />
                    <span className="text-xs text-[#555555]">Keep session active</span>
                  </label>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#888888]">
                    256-bit SSL
                  </span>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-[#111111] hover:bg-black text-white font-medium text-xs tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Login</span>
                      <FaArrowRight size={10} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Footer Ribbon in Card */}
            <div className="px-6 py-3 bg-[#FAFAF8] border-t border-[#EAEAE6] text-center">
              <p className="text-[11px] text-[#777777]">
                Authorized Bourse Member Credentials Required
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full text-center text-xs text-[#777777] py-3.5 border-t border-[#E8E8E4] bg-white/50">
        <div className="flex items-center justify-center gap-2">
          <span>Royal Rays BV</span>
          <span>•</span>
          <span>House of Fancy Diamonds</span>
          <span>•</span>
          <span>Since 1984</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;
