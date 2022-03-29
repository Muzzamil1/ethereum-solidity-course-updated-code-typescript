/* eslint-disable jsx-a11y/anchor-is-valid */
import type { NextPage } from 'next';
import { Button, Table } from 'semantic-ui-react';

import { Request } from 'pages/campaigns/[campaign]/requests';
import Campaign from 'utils/campaign';
import web3 from 'utils/web3';

interface Props {
  id: number;
  request: Request;
  address: string;
  approversCount: string;
}

const RequestRow: NextPage<Props> = ({ id, request, address, approversCount, }) => {
  const handleApprove = async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  const handleFinalize = async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0],
    });
  };
  const { Row, Cell, } = Table;
  const readyToFinalize = Number(request.approvalCount) > Number(approversCount) / 2;

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>

      <Cell>{request.description}</Cell>

      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>

      <Cell>{request.recipient}</Cell>

      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>

      <Cell>
        {request.complete ? null : (
          <Button
            color='green'
            basic
            onClick={handleApprove}
          >
            Approve
          </Button>
        )}
      </Cell>

      <Cell>
        {request.complete ? null : (
          <Button
            color='teal'
            basic
            onClick={handleFinalize}
          >
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
