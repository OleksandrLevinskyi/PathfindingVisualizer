import type {Component} from 'solid-js';

const ObstacleTypeSelector: Component = () => {
    return (
        <div class="col-md-1 d-flex justify-content-center">
            <div class="btn-group-vertical w-auto content" role="group" aria-label="obstacle type group">
                <input type="radio" class="btn-check w-50" name="obstacle"
                       id="obstacle_wall" value="wall" autocomplete="off" checked/>
                <label
                    class="btn btn-outline-primary d-inline-flex align-items-center justify-content-start p-0 ps-1 pe-1"
                    for="obstacle_wall">
                    <img class="sized-icon me-1"
                         src="/images/wall.png"
                         alt="wall"/> wall
                </label>

                <input type="radio" class="btn-check w-50" name="obstacle"
                       id="obstacle_weight" value="weight" autocomplete="off"/>
                <label
                    class="btn btn-outline-primary d-inline-flex align-items-center justify-content-start p-0 ps-1 pe-1"
                    for="obstacle_weight">
                    <img class="sized-icon me-1"
                         src="/images/weight.png"
                         alt="weight"/> weight
                </label>
            </div>
        </div>
    );
};

export default ObstacleTypeSelector;
