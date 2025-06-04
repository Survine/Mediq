const AdminHeader = ({ title, description }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/30">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default AdminHeader;