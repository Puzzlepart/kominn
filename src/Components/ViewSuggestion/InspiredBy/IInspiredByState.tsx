import { Suggestion } from "../../Common/Suggestion";
import { InspiredByView } from "./InspiredByView";

export interface IInspiredByState {
    suggestions?: Suggestion[];
    selectedView?: InspiredByView;
}
