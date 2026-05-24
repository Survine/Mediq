import { FaPlus } from "react-icons/fa6";
import  SearchBar  from "./SearchBar";

const Toolbar = ({ 
  onAddClick, 
  searchTerm, 
  setSearchTerm, 
  searchType, 
  setSearchType, 
  searchOptions, 
  isLoading,
  addButtonText = "Add Item"
}) => {
  return (
    <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white border border-gray-200 rounded-md">
      <div className="flex items-center gap-2">
        <button
          onClick={onAddClick}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-colors"
          disabled={isLoading}
        >
          <FaPlus /> {addButtonText}
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchType={searchType}
        setSearchType={setSearchType}
        searchOptions={searchOptions}
        isLoading={isLoading}
      />
    </div>
  );
};
export default Toolbar;
