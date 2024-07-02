import React, { useState, useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Autocomplete = () => {
  const [predictions, setPredictions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'YOUR_API_KEY', // Replace with your actual API key
      libraries: ['places'],
    });

    loader.load().then(() => {
      const autocomplete = new google.maps.places.AutocompleteService();

      const displaySuggestions = (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        setPredictions(predictions);
      };

      inputRef.current.addEventListener('input', () => {
        autocomplete.getQueryPredictions(
          { input: inputRef.current.value },
          displaySuggestions
        );
      });
    });
  }, []);

  return (
    <div>
      <input type="text" ref={inputRef} placeholder="Enter a location" />
      <ul>
        {predictions.map((prediction) => (
          <li key={prediction.place_id}>{prediction.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;