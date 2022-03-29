/* eslint-disable jsx-a11y/anchor-is-valid */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';

import Layout from 'layout/Layout';
import factory from 'utils/factory';

interface Props {
  campaigns: string[];
}

const Home: NextPage<Props> = ({ campaigns, }) => {
  const renderCampaigns = () => {
    const items = campaigns.map((campaign) => {
      return {
        header: campaign,
        description: (
          <Link
            href='/campaigns/[campaign]'
            as={`/campaigns/${campaign}`}
          >
            <a >View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: {
          marginLeft: '0',
        },
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <div>
      <Head>
        <title>Open Campaigns</title>

        <meta
          name='description'
          content='Kickstart project'
        />

        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Link href='/campaigns/new'>
            <a>
              <Button
                floated='right'
                content='Create Campaign'
                icon='add circle'
                primary
              />
            </a>
          </Link>

          {renderCampaigns()}
        </div>
      </Layout>
    </div>
  );
};

Home.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return { campaigns, };
};

export default Home;
