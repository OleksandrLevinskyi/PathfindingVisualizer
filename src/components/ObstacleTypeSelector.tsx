import type {Component} from 'solid-js';
import RadioButton from "./RadioButton";
import {OBSTACLE} from "../ts/types";

const ObstacleTypeSelector: Component = () => {
    return (
        <div class="col-md-1 d-flex justify-content-center">
            <div class="btn-group-vertical w-auto content" role="group" aria-label="obstacle type group">
                <RadioButton type={OBSTACLE.WALL} isChecked={true}/>
                <RadioButton type={OBSTACLE.WEIGHT} isChecked={false}/>
            </div>
        </div>
    );
};

export default ObstacleTypeSelector;
