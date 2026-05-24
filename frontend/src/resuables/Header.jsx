import { UserButton, useUser } from '@clerk/clerk-react';

const Header = ({ title, description }) => {
  const { user } = useUser();

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-md flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
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
