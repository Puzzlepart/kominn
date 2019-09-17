import * as React from "react";
import { ISubmitterProps } from "./ISubmitterProps";

export class Submitter extends React.Component<ISubmitterProps, {}>
{
    render() {
        return (
            <address>
                <span className="author">{this.props.submitter.Name}</span>
                {this.props.submitter.Address}<br />
                {this.props.submitter.Zipcode} {this.props.submitter.City}
            </address>
        )
    }
}