import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {MdClose, MdSearch} from 'react-icons/md'
import {
  HomeBgDiv,
  SideVideoDiv,
  VideosDiv,
  PlanBannerDiv,
  ContentDiv,
  BannerLogo,
  BannerPara,
  BannerBtn,
  VideoSearchCont,
  SearchDiv,
  SearchInput,
  SearchButton,
  ColumnCont,
  FailureImage,
  Button,
  FailureH1,
  FailurePara,
  RetryBtn,
  UlCont,
} from './styledComponents'
import './index.css'

import Vidoecontext from '../../contextComponent/componetcontext'
import VidoeListItem from '../VidoeListItem'
import Header from '../Header'
import SideNav from '../SideNav'

const currentStatus = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class Home extends Component {
  state = {
    searchTerms: '',
    showPlanBanner: true,
    videosList: [],
    apiStatus: currentStatus.initial,
  }

  componentDidMount() {
    this.getVideos()
  }

  getVideos = async () => {
    this.setState({apiStatus: currentStatus.inProgress})
    const {searchTerms} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/all?search=${searchTerms}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = data.videos.map(each => ({
        id: each.id,
        title: each.title,
        thumbnailUrl: each.thumbnail_url,
        channel: each.channel,
        viewCount: each.view_count,
        publishedAt: each.published_at,
      }))

      this.setState({
        apiStatus: currentStatus.success,
        videosList: formattedData,
      })
    } else {
      this.setState({apiStatus: currentStatus.failure})
    }
  }

  closeBanner = () => {
    this.setState({showPlanBanner: false})
  }

  searchChange = event => {
    this.setState({searchTerms: event.target.value})
  }

  getSearchResults = () => {
    this.getVideos()
  }

  renderLoader = () => (
    <ColumnCont>
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </ColumnCont>
  )

  renderSuccess = () => {
    const {videosList} = this.state
    return videosList.length === 0 ? (
      <Vidoecontext.Consumer>
        {value => {
          const {isLight} = value

          return (
            <ColumnCont>
              <FailureImage
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
                alt="no videos"
              />
              <FailureH1 isLight={isLight}>No Search results found</FailureH1>
              <FailurePara isLight={isLight}>
                Try different key words or remove search filter
              </FailurePara>
              <RetryBtn onClick={this.getVideos}>Retry</RetryBtn>
            </ColumnCont>
          )
        }}
      </Vidoecontext.Consumer>
    ) : (
      <Vidoecontext.Consumer>
        {value => {
          const {isLight} = value

          return (
            <UlCont data-testid="home" isLight={isLight}>
              {videosList.map(each => (
                <VidoeListItem each={each} key={each.id} />
              ))}
            </UlCont>
          )
        }}
      </Vidoecontext.Consumer>
    )
  }

  renderFailure = () => (
    <Vidoecontext.Consumer>
      {value => {
        const {isLight} = value
        const failureImageUrl = isLight
          ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
          : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'

        return (
          <ColumnCont>
            <FailureImage src={failureImageUrl} alt="failure view" />
            <FailureH1 isLight={isLight}>Oops! Something Went Wrong</FailureH1>
            <FailurePara isLight={isLight}>
              We are having some trouble to complete your request. Please try
              again.
            </FailurePara>
            <RetryBtn onClick={this.getVideos}>Retry</RetryBtn>
          </ColumnCont>
        )
      }}
    </Vidoecontext.Consumer>
  )

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case currentStatus.inProgress:
        return this.renderLoader()
      case currentStatus.success:
        return this.renderSuccess()
      case currentStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {searchTerms, showPlanBanner} = this.state

    return (
      <Vidoecontext.Consumer>
        {value => {
          const {isLight} = value

          return (
            <HomeBgDiv isLight={isLight}>
              <Header />
              <SideVideoDiv>
                <SideNav />
                <VideosDiv isLight={isLight}>
                  {showPlanBanner && (
                    <PlanBannerDiv data-testid="banner">
                      <ContentDiv>
                        <BannerLogo
                          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                          alt="nxt watch logo"
                        />
                        <BannerPara>
                          Buy Nxt Watch Premium prepaid plans with UPI
                        </BannerPara>
                        <BannerBtn>GET IT NOW</BannerBtn>
                      </ContentDiv>
                      <Button
                        data-testid="close"
                        type="button"
                        onClick={this.closeBanner}
                      >
                        <MdClose />
                      </Button>
                    </PlanBannerDiv>
                  )}
                  <VideoSearchCont data-testid="home" isLight={isLight}>
                    <SearchDiv isLight={isLight}>
                      <SearchInput
                        type="search"
                        value={searchTerms}
                        placeholder="Search"
                        onChange={this.searchChange}
                      />
                      <SearchButton
                        data-testid="searchButton"
                        onClick={this.getSearchResults}
                      >
                        <MdSearch />
                      </SearchButton>
                    </SearchDiv>
                    {this.renderAll()}
                  </VideoSearchCont>
                </VideosDiv>
              </SideVideoDiv>
            </HomeBgDiv>
          )
        }}
      </Vidoecontext.Consumer>
    )
  }
}
export default Home
