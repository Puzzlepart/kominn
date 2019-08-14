import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { DocumentCard, DocumentCardActions, DocumentCardLocation, DocumentCardPreview, DocumentCardTitle } from "office-ui-fabric-react/lib/DocumentCard";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { ImageFit } from "office-ui-fabric-react/lib/Image";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import * as React from "react";
import { DataAdapter } from "../../../Data/DataAdapter";
import { Status, Suggestion } from "../../../Models";
import { IPopularSuggestionsProps } from "./IPopularSuggestionsProps";
import { IPopularSuggestionsState } from "./IPopularSuggestionsState";
import "./PopularSuggestions.module.scss";
import { PopularSuggestionsFilter } from "./PopularSuggestionsFilter";
import { PopularSuggestionsSortTypes } from "./PopularSuggestionsSortTypes";

export class PopularSuggestions extends React.Component<IPopularSuggestionsProps, IPopularSuggestionsState>
{
    private dataAdapter: DataAdapter = new DataAdapter();

    constructor(props: IPopularSuggestionsProps) {
        super(props);
        this.state = {
            suggestions: [],
            top: 3,
            sorting: PopularSuggestionsSortTypes.DateDesc,
            filter: [],
            filterValues: [],
        };
    }

    componentDidMount() {
        this.loadFilterValues();
        this.loadSuggestions(3);
    }

    private loadMoreSuggestions() {
        this.loadSuggestions(3);
    }

    private async loadSuggestions(incrementTop?: number) {
        var customSort = "";
        if (this.state.sorting != null) {
            if (this.state.sorting == PopularSuggestionsSortTypes.DateAsc)
                customSort = "&$orderby=Created asc";
            else
                customSort = "&$orderby=Created desc";
        }

        var customFilter = `&$filter=KmiStatus eq 'Publisert' and Created gt datetime'${this.props.fromDate.toISOString()}' and Created lt datetime'${this.props.toDate.toISOString()}'`;
        if (this.state.filter != null && this.state.filter.length > 0) {
            for (let f of this.state.filter)
                customFilter += ` and ${encodeURI(`Kmi${f.Type}`)} eq '${encodeURI(f.Value)}'`;
        }
        let suggestions = await this.dataAdapter.getAllSuggestions(Status.Published, this.state.top, customFilter, customSort);
        this.setState({
            suggestions,
            top: this.state.top + incrementTop,
            maxReached: this.state.top > suggestions.length,
        });
    }

    private loadFilterValues() {
        var filterValues = [];
        $.ajax({
            url: `${_spPageContextInfo.webAbsoluteUrl}/_api/web/fields?$filter=InternalName eq 'KmiUsefulnessType' or InternalName eq 'KmiTags'`,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: (data: any) => {
                for (let item of data.d.results) {
                    for (let choice of item.Choices.results) {
                        var filter = new PopularSuggestionsFilter();
                        filter.Type = item.InternalName.replace("Kmi", "");
                        filter.Value = choice;
                        filterValues.push(filter);
                    }
                }
                this.setState({ filterValues });
            },
            error: (error) => {
                alert(JSON.stringify(error));
            }
        });
    }

    private renderPopularSuggestions() {
        return this.state.suggestions.map((i: Suggestion, idx: number) => (
            <div key={`Card_${idx}`} style={{ verticalAlign: "top", display: "inline-block", margin: "0 10px 10px 0" }}>
                <DocumentCard onClickHref={i.Url}>
                    <DocumentCardPreview previewImages={[{ previewImageSrc: i.Image, width: 318, height: 140, imageFit: ImageFit.cover }]} />
                    <DocumentCardTitle title={i.Title} />
                    <DocumentCardLocation location={i.Created.toLocaleDateString()} />
                    <DocumentCardLocation location={i.Submitter.Name} />
                    <DocumentCardActions actions={[
                        { onClick: () => this.dataAdapter.updateLike(i), iconProps: { iconName: "Like" }, name: `${i.Likes}`, },
                        { iconProps: { iconName: "SuggestionComment" }, name: `${i.NumberOfComments}`, },
                    ]} />
                </DocumentCard>
            </div>
        ));
    }

    private sortSuggestions(option: IDropdownOption) {
        this.setState({ sorting: option.data });
        this.loadSuggestions(0);
    }

    private toggleFilter(filter: PopularSuggestionsFilter) {
        var filters = this.state.filter;
        var existed = false;
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].Value === filter.Value && filters[i].Type === filter.Type) {
                filters.splice(i, 1);
                existed = true;
            }
        }
        if (!existed)
            filters.push(filter);

        this.setState({ filter: filters }, () => this.loadSuggestions(0));
    }

    private renderFiltering() {
        var tags = this.state.filterValues.filter((val: PopularSuggestionsFilter) => val.Type === "Tags");
        var usefulnessFilters = this.state.filterValues.filter((val: PopularSuggestionsFilter) => val.Type === "UsefulnessType");
        return (
            <div className="ms-Grid filters">
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

    private renderSorting() {
        return (
            <div className="sorting">
                <Dropdown
                    style={{ width: 200 }}
                    onChange={(_event, option) => this.sortSuggestions(option)}
                    defaultSelectedKey="DateDesc"
                    options={[
                        { key: "DateDesc", text: "Dato nyest - eldst", data: PopularSuggestionsSortTypes.DateDesc },
                        { key: "DateAsc", text: "Dato eldst - nyest", data: PopularSuggestionsSortTypes.DateAsc }
                    ]} />
            </div>
        );
    }

    renderFilter(filter: PopularSuggestionsFilter) {
        return (
            <div className="ms-Grid-col ms-sm6">
                <Toggle label={filter.Value} onChange={_ => this.toggleFilter(filter)} />
            </div>
        );
    }

    showFilter() {
        this.setState({ showSorting: false, showFilter: !this.state.showFilter });
    }

    showSorting() {
        this.setState({ showFilter: false, showSorting: !this.state.showSorting });
    }

    render() {
        if (this.state.suggestions.length === 0) {
            return null;
        }
        return (
            <section className="PopularSuggestions">
                <h2>{this.props.title}</h2>
                <div className="actions">
                    <DefaultButton onClick={this.showFilter.bind(this)} iconProps={{ iconName: "Filter" }} />
                    <DefaultButton onClick={this.showSorting.bind(this)} iconProps={{ iconName: "Sort" }} />
                </div>
                {this.state.showSorting && this.renderSorting()}
                {this.state.showFilter && this.renderFiltering()}
                {this.renderPopularSuggestions()}
                <div className="footer actions">
                    <DefaultButton onClick={this.loadMoreSuggestions.bind(this)} text="Vis flere innsendte forslag" hidden={this.state.maxReached} />
                </div>
            </section>
        );
    }
}