import { Box, Center, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'
import { Logo } from './Logo'
import { Navbar } from './Navbar'
import { NavTabLink } from './NavTabLink'
import { UserProfile } from './UserProfile'

export const NavBarComponent = () => (
  <Navbar>
      <Navbar.Brand>
        <Center marginEnd={6}>
          <Logo h="6" iconColor="blue.600" />
        </Center>
      </Navbar.Brand>
      <Navbar.Links>
        <NavTabLink>Features</NavTabLink>
        <NavTabLink>Documentation</NavTabLink>
        <NavTabLink>Pricing</NavTabLink>
        <NavTabLink>Team</NavTabLink>
      </Navbar.Links>
      <Navbar.UserProfile>
        <UserProfile
          name="Andreas Wahlgren"
          avatarUrl="https://barryburnett.net/wp-content/uploads/2018/03/Blank-Avatar-Man-in-Suit.jpg"
          email="andreas73.wahlgren@gmail.com"
        />
      </Navbar.UserProfile>

    </Navbar>
)
