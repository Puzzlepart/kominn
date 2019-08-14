import { DetailsList, IColumn, SelectionMode } from "office-ui-fabric-react/lib/DetailsList";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import * as React from "react";
import { DataAdapter } from "../../../Data/DataAdapter";
import { IMySuggestionsState } from "./IMySuggestionsState";
import "./MySuggestions.module.scss";
import { Suggestion } from "../../../Models";

export class MySuggestions extends React.Component<any, IMySuggestionsState>
{
	constructor(props: any) {
		super(props);
		this.state = { suggestions: [] };
	}

	async componentWillMount() {
		const suggestions = await new DataAdapter().getMySuggestions();
		this.setState({ suggestions });
	}

	onRenderItemColumn(item: Suggestion, _index: number, column: IColumn) {
		const colValue = item[column.fieldName];
		switch (column.key) {
			case "Title": {
				return <a href={item.Url}>{colValue}</a>;
			}
			case "Likes": {
				return <span><Icon iconName="Like" /> {colValue}</span>;
			}
		}
		return colValue;
	}

	render() {
		return (
			<section className="MySuggestions">
				<div className="container">
					<h2>Mine forslag</h2>
					<DetailsList
						isHeaderVisible={false}
						items={this.state.suggestions}
						columns={[
							{ key: "Title", name: "Title", fieldName: "Title", minWidth: 0 },
							{ key: "Created", name: "Created", fieldName: "CreatedString", minWidth: 0 },
							{ key: "Likes", name: "Likes", fieldName: "Likes", minWidth: 0 },
							{ key: "Status", name: "Status", fieldName: "StatusString", minWidth: 0 },
						]}
						onRenderItemColumn={this.onRenderItemColumn.bind(this)}
						selectionMode={SelectionMode.none} />
				</div>
			</section>
		)
	}
}