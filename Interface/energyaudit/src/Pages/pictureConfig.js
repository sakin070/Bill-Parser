import React from "react"
import ImageMapper from 'react-image-mapper';

class PictureConfig extends React.Component{
    constructor(props){
        super(props);
    }

    getTipPosition(area) {
        return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
    }
    getInitialState() {
        return { hoveredArea: null, msg: null, moveMsg: null };
    }

    load() {
        this.setState({ msg: "Interact with image !" });
    }

    clicked(area) {
        this.setState({
            msg: `You clicked on ${area.shape} at coords ${JSON.stringify(
                area.coords
            )} !`
        });
    }

    clickedOutside(evt) {
        const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
        this.setState({
            msg: `You clicked on the image at coords ${JSON.stringify(coords)} !`
        });
    }

    moveOnImage(evt) {
        const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
        this.setState({
            moveMsg: `You moved on the image at coords ${JSON.stringify(coords)} !`
        });
    }

    enterArea(area) {
        this.setState({
            hoveredArea: area,
            msg: `You entered ${area.shape} ${area.name} at coords ${JSON.stringify(
                area.coords
            )} !`
        });
    }

    leaveArea(area) {
        this.setState({
            hoveredArea: null,
            msg: `You leaved ${area.shape} ${area.name} at coords ${JSON.stringify(
                area.coords
            )} !`
        });
    }

    moveOnArea(area, evt) {
        const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
        this.setState({
            moveMsg: `You moved on ${area.shape} ${
                area.name
                } at coords ${JSON.stringify(coords)} !`
        });
    }

    getTipPosition(area) {
        return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
    }

    render() {
        return(
            <div>
                <ImageMapper src={URL}  width={500}
                             onLoad={() => this.load()}
                             onClick={area => this.clicked(area)}
                             onMouseEnter={area => this.enterArea(area)}
                             onMouseLeave={area => this.leaveArea(area)}
                             onMouseMove={(area, _, evt) => this.moveOnArea(area, evt)}
                             onImageClick={evt => this.clickedOutside(evt)}
                             onImageMouseMove={evt => this.moveOnImage(evt)}
                />
            </div>
        )
    }
}
export default PictureConfig

