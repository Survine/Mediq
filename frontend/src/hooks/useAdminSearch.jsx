import { useState, useEffect } from "react";

const useAdminSearch = (data, searchOptions) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState(searchOptions[0].value);
  const [filteredData, setFilteredData] = useState(data);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(data);
      setSearchError(null);
      return;
    }

    const debounceTimer = setTimeout(() => {
      if (searchType === "id") {
        const numericId = parseInt(searchTerm, 10);
        if (isNaN(numericId)) {
          setFilteredData([]);
          setSearchError("Please enter a valid numeric ID");
          return;
        }
        const matches = data.filter(item => item.id === numericId);
        setFilteredData(matches);
        if (matches.length === 0) {
          setSearchError("No items found matching your search");
        }
      } else {
        const lower = searchTerm.toLowerCase();
        const matches = data.filter(item => 
          String(item[searchType]).toLowerCase().includes(lower)
        );
        setFilteredData(matches);
        if (matches.length === 0) {
          setSearchError("No items found matching your search");
        }
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, data]);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    filteredData,
    searchError,
    setSearchError,
  };
};

export default useAdminSearch;