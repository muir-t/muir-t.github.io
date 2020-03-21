import * as React from 'react';

class Swave extends React.Component {
  componentDidMount() {
    const canvas = this.refs.canvas
  }
  render() {
    return(
      <div>
        <canvas ref="canvas" width={640} height={425} />
      </div>
    )
  }
}
export default Swave
