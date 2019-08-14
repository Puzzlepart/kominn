import * as React from 'react';
import { PopularSuggestionsSortTypes } from './PopularSuggestionsSortTypes';
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { IPopularSuggestionsFiltersSortingProps } from './IPopularSuggestionsFiltersSortingProps';

export default class PopularSuggestionsFiltersSorting extends React.Component<IPopularSuggestionsFiltersSortingProps, {}> {
    public render(): React.ReactElement<IPopularSuggestionsFiltersSortingProps> {
        return (
            <div className="sorting" hidden={this.props.hidden}>
                <Dropdown
                    style={{ width: 200, textAlign: "center" }}
                    onChange={(_event, option) => this.props.onSort(option.data)}
                    defaultSelectedKey="DateDesc"
                    options={[
                        { key: "DateDesc", text: "Dato nyest - eldst", data: PopularSuggestionsSortTypes.DateDesc },
                        { key: "DateAsc", text: "Dato eldst - nyest", data: PopularSuggestionsSortTypes.DateAsc }
                    ]} />
            </div>
        );
    }
}
