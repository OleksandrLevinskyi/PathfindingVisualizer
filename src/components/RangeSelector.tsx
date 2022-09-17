import type {Component} from 'solid-js';
import ObstacleTypeSelector from "./ObstacleTypeSelector";
import Dropdowns from "./Dropdowns";
import CleanOptions from "./CleanOptions";

type RangeSelectorProps = {
    id: string,
    title: string,
    statId: string,
    unit: string,
    min: number,
    max: number,
    step: number,
}

const RangeSelector: Component<RangeSelectorProps> = ({id, title, statId, unit, min, max, step}) => {
    return (
        <span class="w-50 text-center">
            <label class="heading" for={id}>
                {title}
                <span class="fw-lighter fs-sm"> (<span id={statId}/> {unit})</span>
            </label>

            <input type="range" class="form-range" min={min} max={max} step={step} id={id}/>
        </span>
    );
};

export default RangeSelector;
