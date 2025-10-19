import { authenticate } from "../../lib/actions";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="m-2">Login</h1>
      <form action={authenticate} className="flex flex-col gap-2 items-center">
        <input 
          className="center-block border-2 border-gray-300 rounded-md p-2" 
          type="email" 
          placeholder="Email" 
          name="email" 
          required
        />
        <input 
          className="center-block border-2 border-gray-300 rounded-md p-2" 
          type="password" 
          placeholder="Password" 
          name="password" 
          required
        />
        <input type="hidden" name="redirectTo" value={"/"} />
        <button 
          className="center-block bg-blue-500 text-white rounded-md p-2" 
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
      </p>
    </div>
  );
}
