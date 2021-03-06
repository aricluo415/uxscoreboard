import React, { Component } from 'react'
import { League } from 'components'
import { getTodaysDate, isValidDate } from 'helpers/utils'
import { getMlbScores } from 'helpers/api'
import { updatePageInfo } from 'config/metadata'
import seasons from 'data/season-dates'

class MlbContainer extends Component {
  static defaultProps = { league: 'mlb' }
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
      this.makeRequest(this.props.match.params.date)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      clearTimeout(this.refreshId)
      this.makeRequest(this.props.match.params.date)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayId)
    clearTimeout(this.refreshId)
  }

  makeRequest(dt = seasons[this.props.league]['2020'].season.start) {
    if (isValidDate(dt)) {
      this.setState({ isValid: true })
    }

    getMlbScores(dt)
      .then(currentScores => {
        const gamedayDetails = currentScores.dates[0]
        const scores = gamedayDetails !== undefined ? gamedayDetails.games : []
        const year = scores[0]
          ? scores[0].season
          : this.state.year || dt.slice(0, 4)
        this.setState(
          {
            date: dt,
            scores,
            year
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

export default MlbContainer
