import React, { Component } from 'react'
import { League } from 'components'
import { getTodaysDate, isValidDate } from 'helpers/utils'
import { getNbaScores } from 'helpers/api'
import { seasons } from 'data/league_dates'
import { updatePageInfo } from 'config/metadata'

class NbaContainer extends Component {
  static defaultProps = { league: 'nba' }
  state = {
    isLoading: true,
    isValid: false,
    isError: false,
    scores: {},
    year: '',
    date: '',
    today: ''
  }

  componentDidMount() {
    const pageInfo = {
      title: `${this.props.league.toUpperCase()} scores · uxscoreboard`,
      desc: `live ${this.props.league.toUpperCase()} scores · uxscoreboard`
    }
    updatePageInfo(pageInfo)
    this.setState({ today: getTodaysDate() }, () => {
      this.makeRequest(this.props.routeParams.date)
    })
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.refreshId)
    this.makeRequest(nextProps.routeParams.date)
  }

  componentWillUnmount() {
    clearTimeout(this.delayId)
    clearTimeout(this.refreshId)
  }

  makeRequest(dt = '20190613') {
    if (isValidDate(dt)) {
      this.setState({ isValid: true })
    }
    getNbaScores(dt)
      .then(data => {
        this.setState(
          {
            isLoading: false,
            scores: data.games,
            year: data.year,
            date: dt
          },
          () => this.delay()
        )
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          isError: true,
          date: dt
        })
        throw new Error(error)
      })
      .then(() => {
        if (dt === this.state.today) {
          this.refreshScores(dt, 30)
        }
      })
  }

  delay() {
    if (this.state.isLoading) {
      this.delayId = setTimeout(() => {
        this.setState({ isLoading: false })
      }, 960)
    }
  }

  refreshScores(dt, seconds) {
    clearTimeout(this.refreshId)
    this.refreshId = setTimeout(() => this.makeRequest(dt), seconds * 1000)
  }

  render() {
    return <League {...this.state} league={this.props.league} />
  }
}

export default NbaContainer
