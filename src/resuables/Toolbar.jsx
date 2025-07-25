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
    <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white/20">
      <div className="flex items-center gap-2">
        <button
          onClick={onAddClick}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
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