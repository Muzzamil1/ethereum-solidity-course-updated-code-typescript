/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

const HeaderNav = () => {
  return (
    <Menu style={{ marginTop: '10px', }}>
      <Link href='/'>
        <a className='item'>CrowdCoin</a>
      </Link>

      <Menu.Menu position='right'>
        <Link href='/'>
          <a className='item'>Campaigns</a>
        </Link>

        <Link href='/campaigns/new'>
          <a className='item'>+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
export default HeaderNav; 