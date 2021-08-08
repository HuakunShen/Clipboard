import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip';
import MoreIcon from '@material-ui/icons/MoreVert';
import { withRouter, Link } from 'react-router-dom';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../lib/redux_helper';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  offset: theme.mixins.toolbar,
}));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(function Navbar(props) {
    const { position, color } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Menu>
    );
    const logout = () => {
      Axios.post('/api/users/logout')
        .then((res) => {
          props.loadAuth();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <Link to='/clipboard' style={{ color: '#ffffff' }}>
            <IconButton color='inherit'>
              <FileCopyIcon />
            </IconButton>
          </Link>
        </MenuItem>
        {props.auth && props.auth.isAuthenticated ? (
          <MenuItem>
            <IconButton color='inherit' onClick={logout}>
              <i
                className='fas fa-sign-out-alt'
                style={{ color: '#ffffff' }}
              ></i>
            </IconButton>
          </MenuItem>
        ) : (
          <div>
            <MenuItem>
              <Link
                to='/signin'
                style={{ color: '#ffffff', textDecoration: 'none' }}
              >
                <Tooltip title='Sign In'>
                  <IconButton color='inherit'>
                    <i
                      className='fas fa-sign-in-alt'
                      style={{ color: '#ffffff' }}
                    ></i>
                  </IconButton>
                </Tooltip>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                to='/signup'
                style={{ color: '#ffffff', textDecoration: 'none' }}
              >
                <Tooltip title='Sign Up'>
                  <IconButton color='inherit'>
                    <i
                      className='fas fa-user-plus'
                      style={{ color: '#ffffff' }}
                    ></i>
                  </IconButton>
                </Tooltip>
              </Link>
            </MenuItem>
          </div>
        )}
      </Menu>
    );

    return (
      <div className={classes.grow}>
        <AppBar
          position={`${position ? position : 'static'}`}
          color={`${color ? color : 'transparent'}`}
        >
          <Toolbar variant='dense'>
            <Link to='/' style={{ color: '#ffffff' }}>
              <Tooltip title='Home'>
                <IconButton
                  edge='start'
                  className={classes.menuButton}
                  color='inherit'
                  aria-label='open drawer'
                >
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Tooltip title='Clipboard'>
                <Link to='/clipboard' style={{ color: '#ffffff' }}>
                  <IconButton color='inherit'>
                    <FileCopyIcon />
                  </IconButton>
                </Link>
              </Tooltip>
              {props.auth && props.auth.isAuthenticated ? (
                <React.Fragment>
                  <Tooltip title='Logout'>
                    <IconButton color='inherit' onClick={logout}>
                      <i
                        className='fas fa-sign-out-alt'
                        style={{ color: '#ffffff' }}
                      ></i>
                    </IconButton>
                  </Tooltip>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Link
                    to='/signin'
                    style={{ color: '#ffffff', textDecoration: 'none' }}
                  >
                    <Tooltip title='Sign In'>
                      <IconButton color='inherit'>
                        <i
                          className='fas fa-sign-in-alt'
                          style={{ color: '#ffffff' }}
                        ></i>
                      </IconButton>
                    </Tooltip>
                  </Link>
                  <Link
                    to='/signup'
                    style={{ color: '#ffffff', textDecoration: 'none' }}
                  >
                    <Tooltip title='Sign Up'>
                      <IconButton color='inherit'>
                        <i
                          className='fas fa-user-plus'
                          style={{ color: '#ffffff' }}
                        ></i>
                      </IconButton>
                    </Tooltip>
                  </Link>
                </React.Fragment>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon htmlColor='#ffffff' />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    );
  })
);
