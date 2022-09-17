import type {Component} from 'solid-js';
import ObstacleTypeSelector from "./ObstacleTypeSelector";
import Dropdowns from "./Dropdowns";
import CleanOptions from "./CleanOptions";
import RangeSelector from "./RangeSelector";
import Report from "./Report";
import ColorModeSwitch from "./ColorModeSwitch";
import Tutorial from "./Tutorial";

const ControlPanel: Component = () => {
    return (
        <div id="control-panel" class="row pt-3">
            <ObstacleTypeSelector/>

            <Dropdowns/>

            <div class="col-md-4">
                <CleanOptions/>

                <div class="d-inline-flex w-100">
                    <RangeSelector id={'dimension'}
                                   title={'Grid Dimension'}
                                   statId={'grid_dimension'}
                                   unit={'cells/row'}
                                   min={15}
                                   max={201}
                                   step={2}/>

                    <RangeSelector id={'delay'}
                                   title={'Animation Delay'}
                                   statId={'animation_delay'}
                                   unit={'ms'}
                                   min={5}
                                   max={500}
                                   step={5}/>
                </div>
            </div>

            <Report/>

            <div class="col-md-1 d-flex flex-column justify-content-center align-items-end">
                <ColorModeSwitch/>

                <Tutorial/>
            </div>
        </div>
    );
};

export default ControlPanel;
