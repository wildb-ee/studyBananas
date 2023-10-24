'use client';

import { useSession, signOut } from 'next-auth/react';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useRouter } from 'next/navigation'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';


const pages = ['Clubs', 'Public Events', 'Public Messenger'];
const settings = ['Profile', 'Your Clubs', 'Your Messenger', 'Your Scheduler', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const session = useSession();
  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageRouting = (page) => {
    handleCloseNavMenu();


    if (page === 'Public Events') {
      router.push('/public/events');
    }
    else if (page === 'Clubs') {
      router.push('/public/clubs');
    }
    else if (page === 'Public Messenger') {
      router.push('/public/messenger')
    }

  }

  const handleAccountRouting = (setting) => {
    handleCloseUserMenu();

    if (setting == 'Profile') {
      router.push('/user/profile')
    }
    else if (setting === 'Your Clubs') {
      router.push('/user/clubs');
    }
    else if (setting === 'Your Messenger') {
      router.push('/user/messenger');
    }
    else if (setting === 'Your Scheduler') {
      router.push('/user/scheduler')
    }
    else if (setting === 'Logout') {
      signOut();
    }

  }


  return (
    <AppBar position="static" sx={{ bgcolor: '#fdd835' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'darkgreen' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'darkgreen',
              textDecoration: 'none',
            }}
          >
            StudyBananas
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: "darkgreen" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => { handlePageRouting(page) }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'darkgreen' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'darkgreen',
              textDecoration: 'none',
            }}
          >
            StudyBananas
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => { handlePageRouting(page) }}
                sx={{ my: 2, color: 'darkgreen', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>


          {
            (session.data?.user) ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <PersonOutlineIcon sx={{ color: "darkgreen" }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => { handleAccountRouting(setting) }}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>) :
              (
                <>
                  <Box sx={{ flexGrow: 0, marginRight: '10px' }}>
                    <Button variant="contained" href="/user/signup" sx={{ bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}>
                      Sign Up
                    </Button>
                  </Box>

                  <Box sx={{ flexGrow: 0 }}>
                    <Button variant="contained" href="/api/auth/signin" sx={{ bgcolor: "green", ":hover": { bgcolor: "darkgreen" } }}>
                      Sign In
                    </Button>
                  </Box>
                </>
              )


          }

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

