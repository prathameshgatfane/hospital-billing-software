import { useState } from "react";
import { useAuth } from "../../Common/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      if (result.registrationStage === "COMPLETED") {
        navigate("/subadmin");
      } else {
        navigate("/subadmin/profile-completion");
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-charcoal">
        <div className="w-full max-w-md">
          <div
            className="relative rounded-3xl border border-white/20 shadow-2xl
              bg-white/10 backdrop-blur-xl overflow-hidden
              w-full p-6 sm:p-8
              hover:border-white/30 transition-all duration-500"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h3>
              <p className="text-gray-400 text-sm mt-2">Login to manage your hospital</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hospital.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none 
                    focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-gray-500 text-white font-medium
                    shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm outline-none 
                    focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-gray-500 text-white font-medium
                    shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold text-sm uppercase tracking-widest py-4 rounded-2xl
                  hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 transform hover:scale-[1.02] active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login Now"}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between text-xs font-bold">
              <label className="flex items-center text-gray-400 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" title="Forgot Password" id="forgot_password_link" className="text-primary hover:underline cursor-pointer">Forgot?</Link>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" title="Register Now" id="register_link" className="text-primary font-bold hover:underline">Register Now</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
