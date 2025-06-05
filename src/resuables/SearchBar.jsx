import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    searchOptions,
    isLoading
}) => {
    const clearSearch = () => setSearchTerm('');

    return (
        <div className="flex items-center gap-2">
            <select
                value={searchType}
                onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchTerm('');
                }}
                className="bg-white/70 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                disabled={isLoading}
            >
                {searchOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>

            <div className="relative">
                <input
                    type={searchType === "id" ? "number" : "text"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search by ${searchType}...`}
                    className="bg-white/70 border border-gray-300 rounded-lg pl-10 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
                    disabled={isLoading}
                    min={searchType === "id" ? 1 : undefined}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
};
export default SearchBar;