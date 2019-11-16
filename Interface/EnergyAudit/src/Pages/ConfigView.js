import React from "react";
import {isNumberLiteral, objectExpression} from "@babel/types";



class ConfigView extends React.Component{
  static defaultProps = {
    width: 855,
    height: 900,
    strokeStyle: '#F00',
    lineWidth: 1,
  };
  canvas = null;
  ctx = null;
  image = new Image();
  data = null;
  constructor(props){
    super(props);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:9999/selectionList', false);
    xhr.onload =  function ()  {
      // do something to response
      console.log(this.responseText);
    };
    xhr.send();
    this.state = {
      selections:JSON.parse(xhr.responseText),
      selection:[]
    };
  }

  componentDidMount(props) {
    this.ctx = this.canvas.getContext('2d');
    this.image.src = "testImg.png";
    this.image.addEventListener("load" , () => this.ctx.drawImage(this.image,0,0, this.props.width, this.props.height) , false);
    this.ctx.strokeStyle = this.props.strokeStyle;
    this.ctx.lineWidth = this.props.lineWidth;
  }
  parseTuple(t) {
    var items = t.replace(/^\(|\)$/g, "").split("),(");
    items.forEach(function(val, index, array) {
      array[index] = val.split(",").map(Number);
    });
    return items;
  }


  updateCanvas = (rectList) => {
    if (this.isDrag) {
      requestAnimationFrame(this.updateCanvas)
    }
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this.ctx.drawImage(this.image,0,0, this.props.width, this.props.height);
    let i;
    for(i=0; i<rectList.length; i++){
      let rect = this.parseTuple(rectList[i])[0];
      this.ctx.strokeRect(rect[0],rect[1],rect[2],rect[3])
    }
  };

  render() {
    console.log(this.state.selections);
    return <div className="container">
      <div className="row">
        <div className="col-lg-9">
          <canvas  width={this.props.width} height={this.props.height} ref={(c) => {this.canvas=c}}/>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <div className="list-group" id="list-tab" role="tablist">
              {Object.entries(this.state.selections).map((d,key) => {
                return <div>
                <button className="list-group-item list-group-item-action" id="list-home-list" data-toggle="list" role="tab" aria-controls="home" onClick={() => this.updateCanvas(Object.values(d[1]))}>{JSON.stringify(d[0])}</button>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
export default ConfigView;
