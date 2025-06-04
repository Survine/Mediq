const AdminStatusMessages = ({ error, success, isLoading }) => {
  return (
    <>
      {error && (
        <div className="mx-4 mt-2 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mx-4 mt-2 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          <p>{success}</p>
        </div>
      )}

      {isLoading && (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </>
  );
};
export default AdminStatusMessages;