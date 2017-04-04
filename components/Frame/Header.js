import React, {Component} from 'react'
import {css, merge} from 'glamor'
import Link from 'next/link'
import Router from 'next/router'
import Status from '../Status'

import {
  Logo,
  Button,
  Container, CONTENT_PADDING as CONTAINER_PADDING,
  colors, mediaQueries
} from '@project-r/styleguide'

import Menu from './Menu'
import Toggle from './Toggle'
import LoadingBar from './LoadingBar'
import {SIDEBAR_WIDTH, HEADER_HEIGHT} from './constants'

const styles = {
  bar: css({
    zIndex: 10,
    position: 'fixed',
    '@media print': {
      position: 'absolute'
    },
    top: 0,
    left: 0,
    right: 0
  }),
  barOpaque: css({
    backgroundColor: '#fff',
    height: 60,
    [mediaQueries.mUp]: {
      height: HEADER_HEIGHT
    },
    borderBottom: `1px solid ${colors.disabled}`
  }),
  menuBar: css({
    position: 'fixed',
    zIndex: 10,
    top: 60,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#fff',
    borderBottom: `1px solid ${colors.disabled}`,
    [mediaQueries.mUp]: {
      display: 'none'
    }
  }),
  menuBarText: css({
    fontSize: 32,
    padding: '7px 15px'
  }),
  logo: css({
    paddingTop: 20,
    [mediaQueries.mUp]: {
      paddingTop: 25
    },
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: 0
  }),
  menu: css({
    [mediaQueries.mUp]: {
      display: 'inline-block',
      marginLeft: 15,
      paddingTop: 25,
      verticalAlign: 'middle'
    }
  }),
  link: css({
    textDecoration: 'none',
    color: colors.text,
    ':visited': {
      color: colors.text
    },
    ':hover': {
      color: '#ccc'
    }
  }),
  cover: css({
    marginBottom: 40
  }),
  side: css({
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    [mediaQueries.mUp]: {
      right: CONTAINER_PADDING,
      width: SIDEBAR_WIDTH
    }
  })
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      opaque: !this.props.cover,
      mobile: true,
      expanded: false
    }

    this.onScroll = () => {
      const y = window.pageYOffset

      const opaque = y > 150 || !this.props.cover

      if (opaque !== this.state.opaque) {
        this.setState(() => ({opaque}))
      }
    }
    this.measure = () => {
      let mobile = window.innerWidth < mediaQueries.mBreakPoint
      if (mobile !== this.state.mobile) {
        this.setState(() => ({mobile}))
      }
      this.onScroll()
    }
  }
  componentDidMount () {
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.measure)
    this.measure()
  }
  componentDidUpdate () {
    this.measure()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.measure)
  }
  render () {
    const {cover, sticky, sidebar, url} = this.props
    const {mobile, expanded} = this.state

    const opaque = this.state.opaque || expanded

    const barStyle = opaque
      ? merge(styles.bar, styles.barOpaque)
      : styles.bar

    let logoHeight = opaque ? 30 : 45
    if (mobile) {
      logoHeight = 18
    }

    const menuItems = [
      {
        label: 'Neues',
        href: '/updates'
      },
      {
        label: 'Tournee',
        href: '/events'
      },
      {
        label: 'Leute',
        href: '/community'
      },
      {
        label: 'FAQ',
        href: '/faq'
      }
    ]

    return (
      <div>
        <div {...barStyle}>
          <Container style={{position: 'relative'}}>
            <Link href='/'>
              <a {...styles.logo}><Logo height={logoHeight} /></a>
            </Link>
            <div {...styles.menu}>
              {(mobile || opaque) && <Menu expanded={expanded}
                id='primary-menu' items={menuItems}>
                {
                  mobile && <Status compact />
                }
              </Menu>}
            </div>
            {opaque && <div {...styles.side}>
              {
                mobile && (
                  <Button block primary onClick={() => {
                    Router.push('/pledge').then(() => window.scrollTo(0, 0))
                  }}>Mitmachen</Button>
                )
              }
              {
                !mobile && (!!sticky.status || !sidebar) && (
                  <Status compact />
                )
              }
            </div>}
          </Container>
        </div>
        {opaque && <div {...styles.menuBar}>
          <div {...styles.menuBarText}>{url.pathname}</div>
          <Toggle expanded={expanded} id='primary-menu'
            onClick={() => this.setState({expanded: !expanded})} />
        </div>}
        <LoadingBar />
        {!!cover && (
          <div {...styles.cover}>
            {cover}
          </div>
        )}
      </div>
    )
  }
}

export default Header