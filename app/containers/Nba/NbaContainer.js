import React, { Component } from 'react'
import { Nba } from 'components'
import { getNbaScores } from 'helpers/api'

class NbaContainer extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
      scores: {},
      date: ''
    }
  }
  componentDidMount() {
    this.makeRequest(this.props.routeParams.date)
  }
  componentWillReceiveProps(nextProps) {
    this.makeRequest(nextProps.routeParams.date)
  }
  makeRequest(dt) {
    getNbaScores(dt)
      .then((currentScores) => {
        this.setState({
          isLoading: false,
          scores: currentScores.sports_content.games,
          date: this.props.routeParams.date || '20161025'
        })
      })
  }
  // cleanGameData(scores) {
  //   if (scores.game !== undefined) {
  //     scores.game.map((game) => {
  //       if (game.visitor.linescores === undefined) {
  //         game.visitor.linescore = null
  //       if (game.home.linescores === undefined) {
  //         game.home.linescore = null
  //     })
  //   }
  // }
  render() {
    return (
      <div>
        {this.state.scores
          ? <Nba
              isLoading={this.state.isLoading}
              scores={this.state.scores}
              date={this.state.date}
            />
          : null
        }
      </div>
    )
  }
}


export default NbaContainer
