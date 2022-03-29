import React, { useState } from 'react';

import Router from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';

import Layout from 'layout/Layout';
import factory from 'utils/factory';
import web3 from 'utils/web3';

interface Props { }

const CampaignNew = (props: Props) => {
  const [minimumContribution, setMinimumContribution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError('');

    setIsLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      const createCampaign = await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0], });

      Router.push('/');
    } catch (error) {
      const err = error as Error;
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>

      <Form
        onSubmit={onSubmit}
        error={!!error}
      >
        <Form.Field>
          <label htmlFor='wei'>Minimum contribution</label>

          <Input
            label='wei'
            id='wei'
            labelPosition='right'
            value={minimumContribution}
            onChange={(event) =>
              setMinimumContribution(event.target.value)
            }
          />
        </Form.Field>

        <Message
          error
          header='Oops!'
          content={error}
        />

        <Button
          loading={isLoading}
          primary
        >
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
