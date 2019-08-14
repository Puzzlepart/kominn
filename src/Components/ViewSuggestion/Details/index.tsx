import * as React from "react";
import { Tools } from "../../Common/Tools";
import { SustainabilityGoal } from "../../Common/SustainabilityGoal";
import { IDetailsProps } from "./IDetailsProps";

export class Details extends React.Component<IDetailsProps, any>
{
    render() {
        return (
            <>
                <time>{Tools.formatDate(this.props.suggestion.Created)}</time>
                <strong className="author">{this.props.suggestion.Submitter.Name}</strong>
                <address>
                    {this.props.suggestion.Submitter.Address}<br />
                    {this.props.suggestion.Submitter.Zipcode} {this.props.suggestion.Submitter.City}
                </address>
                <div style={{ margin: '10px 0 10px 0' }}>
                    <div><strong>Nyttetype</strong></div>
                    <div>{this.props.suggestion.UsefulnessType}</div>
                </div>
                <div style={{ margin: '10px 0 10px 0' }} hidden={this.props.suggestion.SustainabilityGoals.length === 0}>
                    <div><strong>Bærekraftsmål</strong></div>
                    <div>
                        {this.props.suggestion.SustainabilityGoals.map((goal: SustainabilityGoal, idx: number) => {
                            return <img key={idx} src={goal.ImageSrc} style={{ display: "inline-block", minHeight: "auto", height: "47px", width: "47px", marginTop: "2px", marginRight: "5px" }} />
                        })}
                    </div>
                </div>
            </>
        )
    }
}