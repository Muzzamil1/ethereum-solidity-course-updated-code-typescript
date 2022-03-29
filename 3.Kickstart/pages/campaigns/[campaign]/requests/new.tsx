/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { Form, Button, Message, Input } from 'semantic-ui-react';

import Layout from 'layout/Layout';
import Campaign from 'utils/campaign';
import web3 from 'utils/web3';

interface Props {
  address: string;
}

const RequestNew: NextPage<Props> = ({ address, }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0], });

      Router.push(
        '/campaigns/[campaign]/requests',
        `/campaigns/${address}/requests`
      );
    } catch (error) {
      const err = error as Error;
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Link
        href='/campaigns/[campaign]/requests'
        as={`/campaigns/${address}/requests`}
      >
        <a>Back</a>
      </Link>

      <h3>Create a Request</h3>

      <Form
        onSubmit={onSubmit}
        error={!!error}
      >
        <Form.Field>
          <label htmlFor='description'>Description</label>

          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            id='description'
          />
        </Form.Field>

        <Form.Field>
          <label htmlFor='value'>Value in Ether</label>

          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            id='value'
          />
        </Form.Field>

        <Form.Field>
          <label htmlFor='recipient'>Recipient</label>

          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            id='recipient'
          />
        </Form.Field>

        <Message
          error
          header='Oops!'
          content={error}
        />

        <Button
          primary
          loading={isLoading}
        >
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

RequestNew.getInitialProps = async (context: NextPageContext) => {
  const campaignAddress = context.query.campaign as string;

  return { address: campaignAddress, };
};

export default RequestNew;
