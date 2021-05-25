import React from 'react';
import Autosuggest from 'react-autosuggest';

const Nominatim = require('nominatim-geocoder');
const geocoder = new Nominatim({
  delay: 1000, // delay between requests
  secure: true, // enables ssl
  host:'nominatim.openstreetmap.org',
}, {
  limit: 10,
});

var searchValue = "";
var dataResult;
var searchDelayTimer;
var enterPressed = true;

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.display_name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.display_name}
  </div>
);

class Example extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.props = props;

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onKeyPress = (e) => {
    if (e.keyCode === 13) {
      enterPressed = true;
    }
    else {
      enterPressed = false;
    }
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    searchValue = inputValue;

    clearTimeout(searchDelayTimer);

    let _t = this;
    if ( inputLength > 1) {
      searchDelayTimer = setTimeout(function() {
        geocoder.search( { q: searchValue } )
          .then((response) => {
            _t.setState({
              suggestions: response
            });
            dataResult = response;


            if (enterPressed && dataResult.length > 0) {
              let d = dataResult[0];
              window.showSearchResult(d);
            }

          })
          .catch((error) => {
            console.log(error)
          });
      }, 1000);
    };
  };
  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    let d = dataResult[suggestionIndex];
    window.showSearchResult(d);
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search a place',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyPress,
      autocorrect: "off",
      autocomplete: "off"
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Example;