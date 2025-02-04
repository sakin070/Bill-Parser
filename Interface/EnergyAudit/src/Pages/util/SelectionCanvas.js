import React from "react"
import './SelectionCanvas.css'

class SelectionCanvas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false,
            x: -1,
            y: -1,
            w: -1,
            h: -1
        };
        this.onSelected=this.onSelected.bind(this);
    }

    onSelected (rect)  {
        if (!rect.w && !rect.h) {
            return;
        }
        this.setState({
            selected: true,
            ...rect
        });
        this.props.onSelect(rect);

    };

    getSelectionStr() {
        if (this.state.selected) {
            const state = this.state;
            return `x: ${state.x}, y: ${state.y}, w: ${state.w}, h: ${state.h}`
        }
        return 'No Selection';
    }

    render() {
        return (
            <div>
                <Rector   onSelected={this.onSelected} imgPath={this.props.imgPath} rectList={this.props.rectList}/>
                {/*<div>*/}
                {/*    {this.getSelectionStr()}*/}
                {/*</div>*/}
            </div>
        )
    }
}

class Rector extends React.Component {
    static defaultProps = {
        width: 855,
        height: 900,
        strokeStyle: '#F00',
        lineWidth: 1,
        onSelected: () => {},
    };

    canvas = null;
    ctx = null;
    isDirty = false;
    isDrag = false;
    startX = -1;
    startY = -1;
    curX = -1;
    curY = -1;
    image = new Image();

    constructor(props) {
        super(props);
        console.log(props);
    }

    componentDidMount(props) {
        this.ctx = this.canvas.getContext('2d');
        this.image.src = this.props.imgPath;
        this.image.addEventListener("load" , () => this.ctx.drawImage(this.image,0,0, this.props.width, this.props.height) , false);
        this.ctx.strokeStyle = this.props.strokeStyle;
        this.ctx.lineWidth = this.props.lineWidth;


        this.addMouseEvents()
    }

    updateCanvas = () => {
        //this.draw()
        if (this.isDrag) {
            requestAnimationFrame(this.updateCanvas)
        }
        if (! this.isDirty) {
            return
        }

        this.ctx.clearRect(0, 0, this.props.width, this.props.height);
        this.ctx.drawImage(this.image,0,0, this.props.width, this.props.height);
        if (this.isDrag) {
            const rect = {
                x: this.startX,
                y: this.startY,
                w: this.curX - this.startX,
                h: this.curY - this.startY,
            };
            this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
        }
        this.isDirty = false;
        for(let i=0; i<this.props.rectList.length; i++){
            let rect = this.props.rectList[i];
            this.ctx.strokeRect(rect["x"],rect["y"],rect["w"],rect["h"])
        }
    };

    componentWillUnmount() {
        this.removeMouseEvents()
    }

    addMouseEvents() {
        document.addEventListener('mousedown', this.onMouseDown, false);
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('mouseup', this.onMouseUp, false);
    }
    removeMouseEvents() {
        document.removeEventListener('mousedown', this.onMouseDown, false);
        document.removeEventListener('mousemove', this.onMouseMove, false);
        document.removeEventListener('mouseup', this.onMouseUp, false);
    }

    onMouseDown = (e) => {
        this.isDrag = true;
        this.curX = this.startX = e.offsetX;
        this.curY = this.startY = e.offsetY;
        requestAnimationFrame(this.updateCanvas)
    };

    onMouseMove = (e) => {
        if (! this.isDrag) return;
        this.curX = e.offsetX;
        this.curY = e.offsetY;
        this.isDirty = true
    };

    onMouseUp = (e) => {
        this.isDrag = false;
        this.isDirty = true;

        const rect = {
            x: Math.min(this.startX, this.curX),
            y: Math.min(this.startY, this.curY),
            w: Math.abs(e.offsetX - this.startX),
            h: Math.abs(e.offsetY - this.startY),
        };
        this.props.onSelected(rect)
    };

    render() {
        return <canvas  width={this.props.width} height={this.props.height} ref={(c) => {this.canvas=c}}/>
    }
}

export default SelectionCanvas
