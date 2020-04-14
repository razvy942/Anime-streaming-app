import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

export default class Example extends PureComponent {
  data = [];

  componentWillMount() {
    //console.log(this.props.scores);
    let i = 1;
    for (let score in this.props.scores) {
      if (parseInt(score) % 2 !== 0) continue;
      let obj = { name: i++, votes: parseInt(this.props.scores[score]) };
      this.data.push(obj);
    }
    //console.log(this.data);

    // for (let score in this.props.scores) {
    //   //let obj = {};
    //   this.props.scores[score]['name'] = score;
    //   this.data.push(this.props.scores[score]);
    //   console.log(this.props.scores[score]);
    // }
    // console.log(this.data);
  }

  render() {
    return (
      <BarChart width={240} height={150} data={this.data}>
        <XAxis dataKey="name" />

        <Tooltip />
        <Bar dataKey="votes" fill="#d6d6d6" />
      </BarChart>
    );
  }
}
