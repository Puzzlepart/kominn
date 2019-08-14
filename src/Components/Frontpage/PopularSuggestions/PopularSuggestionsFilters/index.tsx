import * as React from 'react';
import { PopularSuggestionsFilter } from './PopularSuggestionsFilter';
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { IPopularSuggestionsFiltersProps } from './IPopularSuggestionsFiltersProps';
import { IPopularSuggestionsFiltersState } from './IPopularSuggestionsFiltersState';

export default class PopularSuggestionsFilters extends React.Component<IPopularSuggestionsFiltersProps, IPopularSuggestionsFiltersState> {
    public render(): React.ReactElement<IPopularSuggestionsFiltersProps> {
        var tags = this.props.filters.filter((val: PopularSuggestionsFilter) => val.Type === "Tags");
        var usefulnessFilters = this.props.filters.filter((val: PopularSuggestionsFilter) => val.Type === "UsefulnessType");
        return (
            <div className="ms-Grid filters" hidden={this.props.hidden}>
                <div className="ms-Grid-row">
                    <h3 style={{ marginTop: 10 }}>Kategori</h3>
                    {tags.map((filter) => this.renderFilter(filter))}
                </div>
                <div className="ms-Grid-row">
                    <h3 style={{ marginTop: 10 }}>Nytteverdi</h3>
                    {usefulnessFilters.map((filter) => this.renderFilter(filter))}
                </div>
            </div>
        )
    }

    private renderFilter(filter: PopularSuggestionsFilter) {
        return (
            <div className="ms-Grid-col ms-sm6">
                <Toggle label={filter.Value} onChange={_ => this.props.onChanged(filter)} />
            </div>
        );
    }
}
