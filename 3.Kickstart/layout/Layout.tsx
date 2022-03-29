import React from 'react';

import { Container } from 'semantic-ui-react';

import { HeaderNav } from 'components';

interface Props {
  children: React.ReactNode
}

const Layout = ({ children, }: Props) => {
  return (
    <Container>
      <HeaderNav />

      {children}
    </Container>
  );
};

export default Layout;