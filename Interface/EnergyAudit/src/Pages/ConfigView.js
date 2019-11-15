import React from "react";



class ConfigView extends React.Component{
  static defaultProps = {
    width: 320,
    height: 200,
    strokeStyle: '#F00',
    lineWidth: 1,
  };
  canvas = null;
  ctx = null;
  image = new Image();

  constructor(props){
    super(props);
    this.state = {
      selections:[],
      selection:[]
    };
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:9999/selectionlist', true);
    xhr.onload = function () {
      // do something to response
      this.setState({selections : this.responseText});
      console.log(this.responseText);
    };
    xhr.send();
  }

  componentDidMount(props) {
    this.ctx = this.canvas.getContext('2d');
    this.image.src = "testImg.png";
    this.image.addEventListener("load" , () => this.ctx.drawImage(this.image,0,0, this.props.width, this.props.height) , false);
    this.ctx.strokeStyle = this.props.strokeStyle;
    this.ctx.lineWidth = this.props.lineWidth;
    let i;
    for(i=0; i<this.state.selection.length; i++){
      let rect = this.state.selection[i]
      this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    }
  }

  updateCanvas = () => {
    //this.draw()
    if (this.isDrag) {
      requestAnimationFrame(this.updateCanvas)
    }

    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    let i;
    for(i=0; i<this.state.selection.length; i++){
      let rect = this.state.selection[i];
      this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
    }


  };

  selectSelection = (selection) => {

  };

  render() {
    return <div>
      <div className="row">
        <div className="col-4">
          <div className="list-group" id="list-tab" role="tablist">
            <a className="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" role="tab" aria-controls="home">Home</a>
          </div>
        </div>
      </div>
      <canvas  width={this.props.width} height={this.props.height} ref={(c) => {this.canvas=c}}/>
    </div>
  }

}
export default ConfigView;
