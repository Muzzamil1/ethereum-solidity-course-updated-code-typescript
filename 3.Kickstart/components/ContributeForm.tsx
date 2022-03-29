import React, { useState } from 'react';

import type { NextPage } from 'next';
import Router from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import Campaign from 'utils/campaign';
import web3 from 'utils/web3';

interface Props {
  address: string;
}

const Home: NextPage<Props> = ({ address, }) => {

  const [minimumContribution, setMinimumContribution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(minimumContribution, 'ether'),
      });

      Router.replace(
        '/campaigns/[campaign]',
        `/campaigns/${address}`
      );

      Router.push('/');
    } catch (error) {
      const err = error as Error;
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        error={!!error}
      >
        <Form.Field>
          <label htmlFor='amount'>Amount to Contribute</label>

          <Input
            value={minimumContribution}
            onChange={event => setMinimumContribution(event.target.value)}
            label='ether'
            labelPosition='right'
            id='amount'
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
          Contribute!
        </Button>
      </Form>
    </>
  );
};

export default Home;
