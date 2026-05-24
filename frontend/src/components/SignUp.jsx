import { SignUp } from '@clerk/clerk-react';
import { FaPills } from 'react-icons/fa';
import loginimg from '../assets/login_bg.jpg';

const SignUpPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2">

                {/* Left - Image */}
                <div className="hidden lg:block">
                    <img
                        src={loginimg}
                        alt="Medical sign up"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Right - Form */}
                <div className="p-8 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {/* Logo and Headings */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-blue-100 p-3 rounded-md">
                                <FaPills className="text-blue-600 text-3xl" />
                            </div>
                            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                                Create Account
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Sign up for a new account
                            </p>
                        </div>

                        {/* Clerk Sign Up Component */}
                        <div className="flex justify-center">
                            <SignUp
                                appearance={{
                                    elements: {
                                        formButtonPrimary:
                                            'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
                                        card: 'shadow-none border-0 bg-transparent',
                                        headerTitle: 'hidden',
                                        headerSubtitle: 'hidden',
                                        socialButtonsBlockButton:
                                            'border border-gray-300 hover:bg-gray-50',
                                        formFieldInput:
                                            'px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500',
                                        footerActionLink: 'text-blue-600 hover:text-blue-700',
                                    },
                                }}
                                redirectUrl="/"
                                signInUrl="/"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
