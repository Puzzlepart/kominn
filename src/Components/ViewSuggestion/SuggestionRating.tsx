import * as React from "react";
import { Row, Col } from "react-bootstrap";
import { Slider, Toggle, TextField } from "office-ui-fabric-react";
import { Suggestion } from "../Common/Suggestion";


interface ISuggestionRatingState {
    ScoreFeasability: number,
    ScoreUserInvolvement: number,
    ScoreDistributionPotential: number,
    ScoreDegreeOfInnovation: number,
    MoreActors: boolean,
    LawRequirements: boolean,
    Saving: boolean,
    ShortComment: string,
    ExistingId: number,
    Saved: boolean,
    UserHasPermissions: boolean

}

interface ISuggestionRatingProps {
    sugggestion: Suggestion
}

export class SuggestionRating extends React.Component<ISuggestionRatingProps, ISuggestionRatingState>
{
    state = {
        ScoreFeasability: 5,
        ScoreUserInvolvement: 5,
        ScoreDistributionPotential: 5,
        ScoreDegreeOfInnovation: 5,
        MoreActors: false,
        LawRequirements: false,
        ShortComment: "",
        Saving: false,
        ExistingId: -1,
        Saved: false,
        UserHasPermissions: false
    }

    private deleteExisting() {
        return new Promise((resolve, reject) => {
            if (this.state.ExistingId === -1) {
                resolve();
                return;
            }
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("Forslagsvurdering");
            var item = list.getItemById(this.state.ExistingId);
            item.deleteObject();
            context.executeQueryAsync(() => {
                resolve();
            }, () => {
                reject();
            })
        });

    }

    private save() {
        if (this.state.Saving)
            return;

        this.setState({ Saving: true, Saved: false }, () => {
            this.deleteExisting().then(() => {
                this.setState({ Saving: true, Saved: false }, () => {
                    this.submit().then(() => {
                        this.setState({ Saving: false, Saved: true });
                    });
                });
            });
        });

    }
    private submit() {
        return new Promise((resolve, reject) => {
            var s = this.state;
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getByTitle("Forslagsvurdering");
            var itemcreationinfo = new SP.ListItemCreationInformation();
            var item = list.addItem(itemcreationinfo);
            item.set_item("Title", this.props.sugggestion.Title);
            item.set_item("KmiScoreFeasability", s.ScoreFeasability);
            item.set_item("KmiScoreUserInvolvement", s.ScoreUserInvolvement);
            item.set_item("KmiScoreDistributionPotential", s.ScoreDistributionPotential);
            item.set_item("KmiScoreDegreeOfInnovation", s.ScoreDegreeOfInnovation);
            item.set_item("KmiMoreActors", s.MoreActors);
            item.set_item("KmiLawRequirements", s.LawRequirements);
            item.set_item("KmiShortComment", s.ShortComment);
            var suggestionLookup = new SP.FieldLookupValue();
            suggestionLookup.set_lookupId(this.props.sugggestion.Id);
            item.set_item("KmiSuggestion", suggestionLookup);
            item.update();
            context.load(item);
            context.executeQueryAsync(
                () => {
                    this.setState({ ExistingId: item.get_id() }, () => {
                        resolve(s);
                    });
                },
                (fail: any, error: any) => {
                    console.log(error.get_message());
                    reject(error.get_message());
                });
        });
    }


    checkPermissionsToList(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Forslagsvurdering')/Items",
                contentType: "application/json;odata=verbose",
                success: () => this.setState({ UserHasPermissions: true }, () => resolve(true)),
                error: () => this.setState({ UserHasPermissions: false }, () => resolve(false))
            })
        });
    }



    getExisting() {
        var exId = this.props.sugggestion.Id;
        var meId = _spPageContextInfo.userId;
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Forslagsvurdering')/Items?$select=*,KmiSuggestion/Id,Author/Id&$expand=KmiSuggestion,Author&$filter=KmiSuggestion/Id eq " + exId + " and Author/Id eq " + meId + "",
            contentType: "application/json;odata=verbose",
            success: (data: any) => {
                if (data.d.results.length === 0)
                    return;
                var [result] = data.d.results;
                this.setState({
                    LawRequirements: result.KmiLawRequirements,
                    MoreActors: result.KmiMoreActors,
                    ScoreDegreeOfInnovation: result.KmiScoreDegreeOfInnovation,
                    ScoreDistributionPotential: result.KmiScoreDistributionPotential,
                    ScoreFeasability: result.KmiScoreFeasability,
                    ScoreUserInvolvement: result.KmiScoreUserInvolvement,
                    ShortComment: result.KmiShortComment || '',
                    ExistingId: result.Id,
                });
            }
        });

    }

    componentWillMount() {
        this.checkPermissionsToList().then((result: boolean) => {
            if (result) {
                this.setState({ UserHasPermissions: true }, () => {
                    this.getExisting();
                });
            }

        });


    }

    render() {
        if (!this.state.UserHasPermissions)
            return <div></div>;

        var saveText = "";
        if (this.state.Saving)
            saveText = "Lagrer...";

        if (this.state.Saved)
            saveText = "Lagret";

        return (
            <div className="SuggestionRatingBox">
                <Row>
                    <Col xs={12}><h3>Forslagsvurdering</h3></Col>
                </Row>

                <Row>
                    <Col xs={12}><Slider label="Score gjennomførbarhet?" max={10} min={0} value={this.state.ScoreFeasability}
                        onChange={(s) => {
                            this.setState({ ScoreFeasability: s });
                        }} /> </Col>
                </Row>
                <Row>
                    <Col xs={12}><Slider label="Score bruker/innbyggerinvolvering?" max={10} min={0} value={this.state.ScoreUserInvolvement}
                        onChange={(s) => {
                            this.setState({ ScoreUserInvolvement: s });
                        }} /> </Col>
                </Row>
                <Row>
                    <Col xs={12}><Slider label="Score spredningspotensial" max={10} min={0} value={this.state.ScoreDistributionPotential}
                        onChange={(s) => {
                            this.setState({ ScoreDistributionPotential: s });
                        }} /> </Col>
                </Row>
                <Row>
                    <Col xs={12}><Slider label="Score innovasjonsgrad" max={10} min={0} value={this.state.ScoreDegreeOfInnovation}
                        onChange={(s) => {
                            this.setState({ ScoreDegreeOfInnovation: s });
                        }} /> </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Toggle label="Flere aktører?" onText="Ja" offText="Nei" checked={this.state.MoreActors}

                            onChanged={(s) => {
                                this.setState({ MoreActors: s });
                            }} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Toggle label="Lovkrav?" onText="Ja" offText="Nei" checked={this.state.LawRequirements}
                            onChanged={(s) => {
                                this.setState({ LawRequirements: s });
                            }} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <TextField label="Kort kommentar" multiline={true} rows={5} value={this.state.ShortComment}
                            onChanged={(s) => {
                                this.setState({ ShortComment: s });
                            }} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <input type="button" value="Lagre" style={{ margin: "0", marginTop: "10px" }} onClick={() => {
                            this.save();
                        }} />
                    </Col>
                    <Col xs={4}>
                        <p>{saveText}</p>
                    </Col>
                </Row>
            </div>
        )

    }


}