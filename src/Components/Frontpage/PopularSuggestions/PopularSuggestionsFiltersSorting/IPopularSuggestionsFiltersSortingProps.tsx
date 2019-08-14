import { PopularSuggestionsSortTypes } from './PopularSuggestionsSortTypes';

export interface IPopularSuggestionsFiltersSortingProps extends React.HTMLProps<HTMLDivElement> {
    onSort: (type: PopularSuggestionsSortTypes) => void;
}
