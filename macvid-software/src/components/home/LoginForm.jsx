import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="relative rounded-3xl border border-white/40 shadow-2xl
        bg-white/70 backdrop-blur-xl overflow-hidden
        w-full p-6 sm:p-8
        hover:border-white/60 transition-all duration-500"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-dark tracking-tight">Login to Dashboard</h3>
        <p className="text-gray-500 text-sm mt-1">Access your hospital metrics</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hospital.com"
            className="w-full bg-gray-100/50 border border-gray-200 rounded-2xl py-4 px-5 text-sm outline-none 
              focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-dark font-medium
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
            className="w-full bg-gray-100/50 border border-gray-200 rounded-2xl py-4 px-5 text-sm outline-none 
              focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-dark font-medium
              shadow-inner"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-bold text-sm uppercase tracking-widest py-4 rounded-2xl
            hover:bg-dark transition-all shadow-lg hover:shadow-primary/20 transform hover:scale-[1.02] active:scale-95"
        >
          Login Now
        </button>
      </form>

      <div className="mt-8 flex items-center justify-between text-xs font-bold">
        <label className="flex items-center text-gray-500 cursor-pointer">
          <input type="checkbox" className="mr-2 accent-primary" />
          Remember me
        </label>
        <span className="text-primary hover:underline cursor-pointer">Forgot?</span>
      </div>
    </div>
  );
};

export default LoginForm;
