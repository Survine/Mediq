import { FaGoogle, FaFacebook, FaPills } from 'react-icons/fa';
import loginimg from '../assets/login_bg.jpg';
import google from '../assets/google.png';

const Login = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2">

                {/* Left - Image */}
                <div className="hidden lg:block">
                    <img
                        src={loginimg}
                        alt="Medical login"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Right - Form */}
                <div className="p-10 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {/* Logo and Headings */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-indigo-100 p-3 rounded-full shadow-sm">
                                <FaPills className="text-indigo-600 text-3xl" />
                            </div>
                            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                                Welcome Back
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Sign in to your account
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block font-bold text-sm text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    placeholder="johndoe@gmail.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block font-bold text-sm text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-indigo-600" />
                                    Remember me
                                </label>
                                <a href="#" className="text-indigo-600 hover:underline">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition duration-200"
                            >
                                Sign in
                            </button>
                        </form>

                        {/* OR divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-200" />
                            <span className="mx-4 text-gray-400 text-sm">or continue with</span>
                            <div className="flex-grow border-t border-gray-200" />
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                {/* <FaGoogle className="text-red-500 mr-2" /> */}
                                <img src={google} className='w-6 h-6 mr-2' alt="Google logo" />
                                <span className="text-sm">Google</span>
                            </button>
                            <button className="flex items-center justify-center py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                <FaFacebook className="text-blue-600 mr-2" />
                                <span className="text-sm">Facebook</span>
                            </button>
                        </div>

                        {/* Sign up */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don’t have an account?{' '}
                            <a href="#" className="text-indigo-600 hover:underline font-medium">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
