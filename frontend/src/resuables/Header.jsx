import { UserButton, useUser } from '@clerk/clerk-react';

const Header = ({ title, description }) => {
  const { user } = useUser();

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/30 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-600">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                  userButtonPopoverCard: 'shadow-lg',
                  userButtonPopoverActionButton: 'text-gray-700 hover:text-gray-900',
                },
              }}
              showName={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;