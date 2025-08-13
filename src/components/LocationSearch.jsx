import React, { useState, useEffect } from 'react';
import { Search, MapPin, Globe, Building, Home, Star, Plus, X } from 'lucide-react';
import { searchLocations, getCurrentWeather } from '../api/weatherApi';

export default function LocationSearch({ onLocationSelect, favorites = [], onAddFavorite, onRemoveFavorite }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (query.length < 3) return;
    
    setLoading(true);
    try {
      const results = await searchLocations(query);
      setSearchResults(results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    onLocationSelect(location);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleAddFavorite = (location) => {
    onAddFavorite(location);
    setShowResults(false);
  };

  const handleRemoveFavorite = (locationId) => {
    onRemoveFavorite(locationId);
  };

  const getLocationTypeIcon = (location) => {
    if (location.region && location.region !== location.name) {
      return <Home className="w-4 h-4 text-blue-400" />;
    }
    return <Building className="w-4 h-4 text-green-400" />;
  };

  const getLocationTypeText = (location) => {
    if (location.region && location.region !== location.name) {
      return 'District/Village';
    }
    return 'City';
  };

  const getLocationDisplayName = (location) => {
    if (location.region && location.region !== location.name) {
      return `${location.name}, ${location.region}`;
    }
    return location.name;
  };

  const isFavorite = (location) => {
    return favorites.some(fav => 
      fav.id === location.id || 
      (fav.name === location.name && fav.region === location.region)
    );
  };

  return (
    <div className="bg-card-bg rounded-3xl p-4 lg:p-6 shadow-dashboard">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-primary text-lg font-semibold">Search Locations</h3>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <Star className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="flex items-center bg-dashboard-bg rounded-xl px-3 py-2.5">
          <Search className="text-gray-400 mr-2 flex-shrink-0" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for cities, districts, villages..."
            className="bg-transparent outline-none text-text-primary placeholder-gray-400 flex-1 text-sm"
          />
          {loading && (
            <div className="ml-2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-dashboard-bg rounded-xl shadow-2xl border border-[#2d3340] z-50 max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div key={index} className="p-3 hover:bg-[#232A3A] transition-colors border-b border-[#2d3340] last:border-b-0">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLocationSelect(result)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {getLocationTypeIcon(result)}
                      <div>
                        <div className="text-text-primary font-medium text-sm">
                          {getLocationDisplayName(result)}
                        </div>
                        <div className="text-text-secondary text-xs">
                          {getLocationTypeText(result)} • {result.country}
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddFavorite(result)}
                    className={`ml-2 p-1 rounded-full transition-colors ${
                      isFavorite(result) 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                    title={isFavorite(result) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className="w-4 h-4" fill={isFavorite(result) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorites Section */}
      {showFavorites && favorites.length > 0 && (
        <div className="border-t border-dashboard-bg pt-4">
          <h4 className="text-text-primary text-sm font-medium mb-3">Favorite Locations</h4>
          <div className="space-y-2">
            {favorites.map((favorite, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-dashboard-bg rounded-lg">
                <div className="flex items-center gap-2">
                  {getLocationTypeIcon(favorite)}
                  <span className="text-text-primary text-sm">
                    {getLocationDisplayName(favorite)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id || index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Remove from favorites"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showFavorites && favorites.length === 0 && (
        <div className="border-t border-dashboard-bg pt-4 text-center">
          <p className="text-text-secondary text-sm">No favorite locations yet</p>
          <p className="text-text-secondary text-xs mt-1">Search and add locations to your favorites</p>
        </div>
      )}
    </div>
  );
}
